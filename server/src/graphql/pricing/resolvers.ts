import { PricingModel } from "../../models/pricing.js";

export const pricingResolvers = {
  Query: {
    pricing: async () => {
      const pricing = await PricingModel.findOne();

      if (!pricing) {
        throw new Error("Pricing content hasn't been added yet. Run the seed script");
      }

      return pricing;
    },
  },
};
