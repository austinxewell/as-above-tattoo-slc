import { GraphQLError } from "graphql";
import { BookingContentModel } from "../../models/booking-content.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanBookingContentInput, type BookingContentInput } from "./validate.js";

export const bookingContentResolvers = {
  Query: {
    bookingContent: async () => {
      const bookingContent = await BookingContentModel.findOne();

      if (!bookingContent) {
        throw new Error("Booking content hasn't been added yet. Run the seed script.");
      }

      return bookingContent;
    },
  },
  Mutation: {
    updateBookingContent: async (
      _parent: unknown,
      { input }: { input: BookingContentInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const bookingContent = await BookingContentModel.findOne();

      if (!bookingContent) {
        throw new GraphQLError("Booking content hasn't been added yet.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      bookingContent.set(cleanBookingContentInput(input));
      await bookingContent.save();
      return bookingContent;
    },
  },
};
