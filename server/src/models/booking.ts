import { Schema, model, type InferSchemaType } from "mongoose";

const bookingSchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: "Artist", index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    placement: { type: String, required: true, trim: true },
    size: { type: String, required: true, enum: ["small", "medium", "large", "project"] },
    budget: { type: String, trim: true },
    idea: { type: String, required: true, trim: true },
    availability: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "declined"],
      default: "new",
      index: true,
    },
    archivedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

export type Booking = InferSchemaType<typeof bookingSchema>;
export const BookingModel = model("Booking", bookingSchema);
