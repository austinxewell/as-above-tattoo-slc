import { BookingContentModel } from "../models/booking-content.js";
import { bookingContent } from "./data/booking-content.js";

export async function seedBookingContent() {
  await BookingContentModel.findOneAndUpdate(
    {},
    {
      intro: bookingContent.intro,
      steps: bookingContent.steps.map(({ title, description }) => ({ title, description })),
      whyRequest: bookingContent.whyRequest,
      disclaimer: bookingContent.disclaimer,
    },
    { upsert: true, runValidators: true },
  );
}
