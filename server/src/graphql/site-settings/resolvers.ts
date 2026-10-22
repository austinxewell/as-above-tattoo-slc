import {
  SiteSettingsModel,
  getBookingRequestsEnabled,
  getPublishingStandards,
  getShopDetails,
  type PublishingStandards,
  type ShopDetails,
} from "../../models/site-settings.js";
import { cleanShopInput, type ShopDetailsInput } from "./validate.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { invalid } from "../validate.js";

type SiteSettingsInput = {
  bookingRequestsEnabled?: boolean | null;
  publishing?: Partial<Record<keyof PublishingStandards, boolean | number | null>> | null;
};

const switches = ["photo", "bio", "statement", "instagram", "booking"] as const;

const minimums = {
  minSpecialties: { label: "Specialties", max: 10 },
  minPieces: { label: "Portfolio pieces", max: 50 },
} as const;

async function readSiteSettings() {
  const [bookingRequestsEnabled, publishing] = await Promise.all([
    getBookingRequestsEnabled(),
    getPublishingStandards(),
  ]);

  return { bookingRequestsEnabled, publishing };
}

function toShopDetails(shop: ShopDetails) {
  return { ...shop, email: shop.email || null };
}

export const siteSettingsResolvers = {
  Query: {
    siteSettings: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      requireRole(context, "admin");
      return readSiteSettings();
    },
    shopDetails: async () => toShopDetails(await getShopDetails()),
  },
  Mutation: {
    updateSiteSettings: async (
      _parent: unknown,
      { input }: { input: SiteSettingsInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const settings = (await SiteSettingsModel.findOne()) ?? new SiteSettingsModel();

      if (typeof input.bookingRequestsEnabled === "boolean") {
        settings.set("bookingRequestsEnabled", input.bookingRequestsEnabled);
      }

      const publishing = input.publishing ?? {};

      for (const key of switches) {
        const value = publishing[key];
        if (typeof value === "boolean") settings.set(`publishing.${key}`, value);
      }

      for (const [key, { label, max }] of Object.entries(minimums)) {
        const value = publishing[key as keyof typeof minimums];
        if (value == null) continue;

        if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > max) {
          invalid(`publishing.${key}`, `${label} must be a whole number from 0 to ${max}.`);
        }

        settings.set(`publishing.${key}`, value);
      }

      await settings.save();
      return readSiteSettings();
    },
    updateShopDetails: async (
      _parent: unknown,
      { input }: { input: ShopDetailsInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const changes = cleanShopInput(input);
      const settings = (await SiteSettingsModel.findOne()) ?? new SiteSettingsModel();

      for (const [key, value] of Object.entries(changes)) {
        settings.set(`shop.${key}`, value);
      }

      await settings.save();
      return toShopDetails(await getShopDetails());
    },
  },
};
