import { BookingContentModel } from "../../models/booking-content.js";

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
};
