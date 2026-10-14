import { PricingModel } from "../models/pricing.js";
import { pricing } from "./data/pricing.js";

export async function seedPricing() {
  await PricingModel.findOneAndUpdate(
    {},
    {
      intro: pricing.intro,
      shopMinimum: pricing.shopMinimum,
      factors: pricing.factors,
      policies: pricing.policies,
      faqs: pricing.faqs,
    },
    { upsert: true, runValidators: true },
  );
}
