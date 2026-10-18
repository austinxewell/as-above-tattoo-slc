import { GraphQLError } from "graphql";
import { isValidObjectId, Types } from "mongoose";
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

export const bookingResolvers = {
  Query: {
    bookingRequestsEnabled: () => bookingRequestsEnabled(),
    bookings: (
      _parent: unknown,
      { mine, archived }: { mine?: boolean | null; archived?: boolean | null },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const onlyMine = mine === true || user.role !== "admin";

      if (onlyMine && !user.artist) {
        return [];
      }

      const access = onlyMine ? { $or: [{ artist: user.artist }, { artist: null }] } : {};
      const archiveFilter =
        archived === true ? { archivedAt: { $ne: null } } : { archivedAt: null };

      return BookingModel.find({ ...access, ...archiveFilter }).sort({ createdAt: -1 });
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
          { slug: artistSlug },
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
