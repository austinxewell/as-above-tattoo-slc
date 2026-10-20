import { GraphQLError } from "graphql";
import { isValidObjectId, Types, type QueryFilter } from "mongoose";
import { createRateLimiter } from "../../security/rate-limit.js";
import { ArtistModel } from "../../models/artist.js";
import { BookingModel, type Booking } from "../../models/booking.js";
import { UserModel } from "../../models/user.js";
import { sendEmail } from "../../email/send-email.js";
import { requireUser, requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";

type BookingRequestInput = {
  artist?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  placement: string;
  size: Booking["size"];
  budget?: string | null;
  idea: string;
  availability?: string | null;
  website?: string | null;
};

const isRateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export function bookingRequestsEnabled() {
  return process.env.BOOKING_REQUESTS_ENABLED === "true";
}

async function findRecipients(artistId?: Types.ObjectId) {
  if (artistId) {
    const artistUser = await UserModel.findOne({ artist: artistId }, { email: 1 });
    if (artistUser) return [artistUser.email];
  }

  return UserModel.distinct("email");
}

async function setArchivedAt(ids: string[], archivedAt: Date | null, context: GraphQLContext) {
  const user = requireUser(context);

  if (ids.length > 100) {
    throw new GraphQLError("You can update up to 100 requests at a time.");
  }

  if (user.role !== "admin" && !user.artist) {
    return 0;
  }

  const access = user.role === "admin" ? {} : { artist: user.artist };
  const filter = { _id: { $in: ids.filter((id) => isValidObjectId(id)) }, ...access };

  const result = await BookingModel.updateMany(filter, { archivedAt });
  return result.matchedCount;
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type BookingFilterArgs = {
  mine?: boolean | null;
  archived?: boolean | null;
  status?: Booking["status"] | null;
  assignment?: string | null;
  search?: string | null;
};

async function buildBookingFilter(
  user: ReturnType<typeof requireUser>,
  { mine, archived, status, assignment, search }: BookingFilterArgs = {},
): Promise<QueryFilter<Booking> | null> {
  const onlyMine = mine === true || user.role !== "admin";

  if (onlyMine && !user.artist) return null;

  const conditions: QueryFilter<Booking>[] = [
    archived === true ? { archivedAt: { $ne: null } } : { archivedAt: null },
  ];

  if (onlyMine) {
    conditions.push({ $or: [{ artist: user.artist }, { artist: null }] });
  }

  if (status) {
    conditions.push({ status });
  }

  if (assignment === "none") {
    conditions.push({ artist: null });
  } else if (assignment === "mine") {
    if (!user.artist) return null;
    conditions.push({ artist: user.artist });
  } else if (assignment) {
    const artist = await ArtistModel.findOne({ slug: assignment });
    if (!artist) return null;
    conditions.push({ artist: artist._id });
  }

  const term = search?.trim().slice(0, 100);

  if (term) {
    const pattern = new RegExp(escapeRegex(term), "i");
    conditions.push({ $or: [{ name: pattern }, { email: pattern }] });
  }

  return { $and: conditions };
}

export const bookingResolvers = {
  Query: {
    bookingRequestsEnabled: () => bookingRequestsEnabled(),
    bookingPage: async (
      _parent: unknown,
      {
        filter,
        page,
        pageSize,
      }: { filter?: BookingFilterArgs | null; page?: number | null; pageSize?: number | null },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const size = Math.min(Math.max(pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
      const current = Math.max(page ?? 1, 1);
      const query = await buildBookingFilter(user, filter ?? {});

      if (!query) {
        return { items: [], total: 0, page: current, pageSize: size };
      }

      const [items, total] = await Promise.all([
        BookingModel.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .skip((current - 1) * size)
          .limit(size),
        BookingModel.countDocuments(query),
      ]);

      return { items, total, page: current, pageSize: size };
    },
    bookingCounts: async (
      _parent: unknown,
      { filter }: { filter?: BookingFilterArgs | null },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const args = filter ?? {};

      const [activeQuery, archivedQuery, statusQuery, artistQuery] = await Promise.all([
        buildBookingFilter(user, { ...args, archived: false }),
        buildBookingFilter(user, { ...args, archived: true }),
        buildBookingFilter(user, { ...args, status: null }),
        buildBookingFilter(user, { ...args, assignment: null }),
      ]);

      const [active, archived, statusGroups, artistGroups] = await Promise.all([
        activeQuery ? BookingModel.countDocuments(activeQuery) : 0,
        archivedQuery ? BookingModel.countDocuments(archivedQuery) : 0,
        statusQuery
          ? BookingModel.aggregate<{ _id: Booking["status"]; count: number }>([
              { $match: statusQuery },
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ])
          : [],
        artistQuery
          ? BookingModel.aggregate<{ _id: Types.ObjectId | null; count: number }>([
              { $match: artistQuery },
              { $group: { _id: "$artist", count: { $sum: 1 } } },
            ])
          : [],
      ]);

      const artistIds = artistGroups.flatMap((group) => (group._id ? [group._id] : []));
      const artists = await ArtistModel.find({ _id: { $in: artistIds } });
      const slugById = new Map(artists.map((artist) => [artist._id.toString(), artist.slug]));

      const sum = (groups: { count: number }[]) =>
        groups.reduce((total, group) => total + group.count, 0);

      return {
        active,
        archived,
        byStatus: statusGroups.map((group) => ({
          status: group._id,
          count: group.count,
        })),
        statusTotal: sum(statusGroups),
        byArtist: artistGroups.flatMap((group): { slug: string | null; count: number }[] => {
          if (!group._id) return [{ slug: null, count: group.count }];

          const slug = slugById.get(group._id.toString());
          return slug ? [{ slug, count: group.count }] : [];
        }),
        artistTotal: sum(artistGroups),
      };
    },
    booking: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      const user = requireUser(context);

      if (!isValidObjectId(id)) return null;

      const booking = await BookingModel.findById(id);
      if (!booking) return null;

      if (user.role === "admin") return booking;

      const isOpenToAll = !booking.artist;
      const isTheirs = Boolean(user.artist && booking.artist?.equals(user.artist));

      return isOpenToAll || isTheirs ? booking : null;
    },
  },
  Mutation: {
    requestBooking: async (
      _parent: unknown,
      { input }: { input: BookingRequestInput },
      context: GraphQLContext,
    ) => {
      if (!bookingRequestsEnabled()) {
        throw new GraphQLError("Online booking requests aren't open yet.");
      }

      if (isRateLimited(context.clientIp)) {
        throw new GraphQLError(
          "You've sent a few requests recently. Please wait a bit and try again.",
        );
      }

      const { artist: artistSlug, website, ...details } = input;

      if (website) {
        return new Types.ObjectId().toString();
      }

      let artist;
      let artistName: string | undefined;

      if (artistSlug) {
        const found = await ArtistModel.findOne(
          { slug: artistSlug, isPublished: true },
          { _id: 1, name: 1, isBooking: 1 },
        );
        if (!found) throw new GraphQLError("That artist doesn't exist.");
        if (!found.isBooking) throw new GraphQLError("That artist's books are closed.");
        artist = found._id;
        artistName = found.name;
      }

      const booking = await BookingModel.create({ ...details, artist });

      try {
        await sendEmail({
          to: await findRecipients(artist),
          replyTo: details.email,
          subject: `New tattoo request from ${details.name} (${artistName ?? "no preference"})`,
          text: [
            `Artist: ${artistName ?? "No preference"}`,
            `Name: ${details.name}`,
            `Email: ${details.email}`,
            `Phone: ${details.phone || "Not given"}`,
            `Placement: ${details.placement}`,
            `Size: ${details.size}`,
            `Budget: ${details.budget || "Not given"}`,
            `Availability: ${details.availability || "Not given"}`,
            "",
            details.idea,
            "",
            "Reply to this email to contact the client directly.",
          ].join("\n"),
        });
      } catch (error) {
        console.error(`Booking ${booking.id} was saved, but the email failed:`, error);
      }

      return booking.id;
    },
    updateBookingStatus: async (
      _parent: unknown,
      {
        ids,
        status,
        assignTo,
      }: { ids: string[]; status: Booking["status"]; assignTo?: string | null },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);

      if (ids.length > 100) {
        throw new GraphQLError("You can update up to 100 requests at a time.");
      }

      if (user.role !== "admin" && !user.artist) {
        return 0;
      }

      const access =
        user.role === "admin" ? {} : { $or: [{ artist: user.artist }, { artist: null }] };
      const filter = { _id: { $in: ids.filter((id) => isValidObjectId(id)) }, ...access };

      if (status === "scheduled") {
        let assignee: Types.ObjectId | null | undefined =
          user.role === "artist" ? user.artist : null;

        if (user.role === "admin" && assignTo) {
          const artist = await ArtistModel.findOne({ slug: assignTo });

          if (!artist) throw new GraphQLError("That artist doesn't exist.");
          assignee = artist._id;
        }

        const unassigned = { ...filter, artist: null };

        if (!assignee && (await BookingModel.exists(unassigned))) {
          throw new GraphQLError("Choose which artist the No preference requests are assigned to.");
        }

        if (assignee) {
          await BookingModel.updateMany(unassigned, { artist: assignee });
        }
      }

      const result = await BookingModel.updateMany(filter, { status });
      return result.matchedCount;
    },
    archiveBookings: (_parent: unknown, { ids }: { ids: string[] }, context: GraphQLContext) =>
      setArchivedAt(ids, new Date(), context),
    unarchiveBookings: (_parent: unknown, { ids }: { ids: string[] }, context: GraphQLContext) =>
      setArchivedAt(ids, null, context),
    deleteBookings: async (
      _parent: unknown,
      { ids }: { ids: string[] },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      if (ids.length > 100) {
        throw new GraphQLError("You can delete up to 100 requests at a time.");
      }

      const result = await BookingModel.deleteMany({
        _id: { $in: ids.filter((id) => isValidObjectId(id)) },
      });
      return result.deletedCount;
    },
  },
  BookingRequest: {
    artist: (booking: { artist?: unknown }) =>
      booking.artist ? ArtistModel.findById(booking.artist) : null,
    archivedAt: (booking: { archivedAt?: Date | null }) =>
      booking.archivedAt?.toISOString() ?? null,
    createdAt: (booking: { createdAt: Date }) => booking.createdAt.toISOString(),
  },
};
