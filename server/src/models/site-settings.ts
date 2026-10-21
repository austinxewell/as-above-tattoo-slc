import { Schema, model, type InferSchemaType } from "mongoose";

export const defaultPublishingStandards = {
  photo: true,
  bio: true,
  statement: true,
  instagram: false,
  booking: true,
  minSpecialties: 1,
  minPieces: 6,
};

export type PublishingStandards = typeof defaultPublishingStandards;

const publishingSchema = new Schema(
  {
    photo: { type: Boolean, default: defaultPublishingStandards.photo },
    bio: { type: Boolean, default: defaultPublishingStandards.bio },
    statement: { type: Boolean, default: defaultPublishingStandards.statement },
    instagram: { type: Boolean, default: defaultPublishingStandards.instagram },
    booking: { type: Boolean, default: defaultPublishingStandards.booking },
    minSpecialties: {
      type: Number,
      default: defaultPublishingStandards.minSpecialties,
      min: 0,
      max: 10,
    },
    minPieces: { type: Number, default: defaultPublishingStandards.minPieces, min: 0, max: 50 },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema(
  {
    // No default on purpose: until an admin saves it, the env var decides.
    bookingRequestsEnabled: { type: Boolean },
    publishing: { type: publishingSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type SiteSettings = InferSchemaType<typeof siteSettingsSchema>;
export const SiteSettingsModel = model("SiteSettings", siteSettingsSchema);

export async function getPublishingStandards(): Promise<PublishingStandards> {
  const settings = await SiteSettingsModel.findOne().lean();
  return { ...defaultPublishingStandards, ...settings?.publishing };
}

export async function getBookingRequestsEnabled() {
  const settings = await SiteSettingsModel.findOne().lean();
  return settings?.bookingRequestsEnabled ?? process.env.BOOKING_REQUESTS_ENABLED === "true";
}
