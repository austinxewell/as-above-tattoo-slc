import { Schema, model, type InferSchemaType } from "mongoose";

const bookingSchema = new Schema(
  {
    minimum: { type: String, required: true, trim: true },
    rate: { type: String, required: true, trim: true },
    deposit: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    notes: { type: [String], default: [] },
  },
  { _id: false },
);

function slugify(value: string) {
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
    bio: { type: String, required: true, trim: true },
    statement: { type: String, required: true, trim: true },
    imgUrl: { type: String, required: true, trim: true },
    instagram: { type: String, trim: true },
    isBooking: { type: Boolean, default: false },
    booking: { type: bookingSchema, required: true },
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
