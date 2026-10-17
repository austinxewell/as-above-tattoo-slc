import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import { createRateLimiter } from "../../security/rate-limit.js";
import { ArtistModel } from "../../models/artist.js";
import { BookingModel, type Booking } from "../../models/booking.js";
import { UserModel } from "../../models/user.js";
import { sendEmail } from "../../email/send-email.js";
import { requireUser } from "../../auth/guards.js";
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

export const bookingResolvers = {
  Query: {
    bookingRequestsEnabled: () => bookingRequestsEnabled(),
    bookings: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const user = requireUser(context);

      const filter =
        user.role === "admin" ? {} : { $or: [{ artist: user.artist }, { artist: null }] };

      return BookingModel.find(filter).sort({ createdAt: -1 });
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
  },
  BookingRequest: {
    artist: (booking: { artist?: unknown }) =>
      booking.artist ? ArtistModel.findById(booking.artist) : null,
    createdAt: (booking: { createdAt: Date }) => booking.createdAt.toISOString(),
  },
};
