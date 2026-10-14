import { Schema, model, type InferSchemaType } from "mongoose";

const bookingContentStepValueSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const bookingContentSchema = new Schema(
  {
    intro: { type: String, required: true, trim: true },
    steps: { type: [bookingContentStepValueSchema], default: [] },
    whyRequest: { type: String, required: true, trim: true },
    disclaimer: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type BookingContent = InferSchemaType<typeof bookingContentSchema>;

export const BookingContentModel = model("BookingContent", bookingContentSchema);
