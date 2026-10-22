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

export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const defaultShopDetails = {
  street: "7692 S Maple St",
  city: "Midvale",
  state: "UT",
  zip: "84047",
  phone: "+13853783438",
  email: "",
  instagram: "asabovetattooslc",
  facebook: "AsAboveTattooSLC",
  hours: weekdays.map((day) => ({ day, isOpen: true, opensAt: "12:00", closesAt: "20:00" })),
};

export type ShopDetails = typeof defaultShopDetails;

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

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const hoursSchema = new Schema(
  {
    day: { type: String, required: true, enum: weekdays },
    isOpen: { type: Boolean, default: true },
    opensAt: { type: String, match: timePattern },
    closesAt: { type: String, match: timePattern },
  },
  { _id: false },
);

const shopSchema = new Schema(
  {
    street: { type: String, trim: true, default: defaultShopDetails.street },
    city: { type: String, trim: true, default: defaultShopDetails.city },
    state: { type: String, trim: true, default: defaultShopDetails.state },
    zip: { type: String, trim: true, default: defaultShopDetails.zip },
    phone: { type: String, trim: true, default: defaultShopDetails.phone },
    email: { type: String, trim: true, lowercase: true, default: defaultShopDetails.email },
    instagram: { type: String, trim: true, default: defaultShopDetails.instagram },
    facebook: { type: String, trim: true, default: defaultShopDetails.facebook },
    hours: {
      type: [hoursSchema],
      default: () => defaultShopDetails.hours.map((entry) => ({ ...entry })),
    },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema(
  {
    // No default on purpose: until an admin saves it, the env var decides.
    bookingRequestsEnabled: { type: Boolean },
    publishing: { type: publishingSchema, default: () => ({}) },
    shop: { type: shopSchema, default: () => ({}) },
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

export async function getShopDetails(): Promise<ShopDetails> {
  const settings = await SiteSettingsModel.findOne().lean();
  const shop = settings?.shop;

  if (!shop) return defaultShopDetails;

  return {
    ...defaultShopDetails,
    ...shop,
    hours: shop.hours.map((entry) => ({
      day: entry.day,
      isOpen: entry.isOpen,
      opensAt: entry.opensAt ?? "",
      closesAt: entry.closesAt ?? "",
    })),
  };
}
