import { Schema, model, type InferSchemaType } from "mongoose";

const bookingSchema = new Schema(
  {
    minimum: { type: String, trim: true, default: "" },
    rate: { type: String, trim: true, default: "" },
    deposit: { type: String, trim: true, default: "" },
    availability: { type: String, trim: true, default: "" },
    notes: { type: [String], default: [] },
  },
  { _id: false },
);

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // é → e
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // spaces and symbols → one dash
    .replace(/^-+|-+$/g, ""); // no dash at either end
}

const artistSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    specialties: { type: [String], default: [] },
    bio: { type: String, trim: true, default: "" },
    statement: { type: String, trim: true, default: "" },
    imgUrl: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true },
    isBooking: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true },
    booking: { type: bookingSchema, default: () => ({}) },
  },
  { timestamps: true },
);

artistSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

export type Artist = InferSchemaType<typeof artistSchema>;
export const ArtistModel = model("Artist", artistSchema);
