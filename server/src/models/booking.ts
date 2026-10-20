import { Schema, model, type InferSchemaType } from "mongoose";

const activitySchema = new Schema({
  type: { type: String, required: true, enum: ["note", "event"] },
  text: { type: String, required: true, trim: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  authorName: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: "Artist", index: true },
    formerArtistName: { type: String, trim: true },
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
    activity: { type: [activitySchema], default: [] },
  },
  { timestamps: true },
);

export type Booking = InferSchemaType<typeof bookingSchema>;
export const BookingModel = model("Booking", bookingSchema);
