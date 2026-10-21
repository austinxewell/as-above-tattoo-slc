import { GraphQLError } from "graphql";
import { PricingModel } from "../../models/pricing.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanPricingInput, type PricingInput } from "./validate.js";

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
  Mutation: {
    updatePricing: async (
      _parent: unknown,
      { input }: { input: PricingInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const pricing = await PricingModel.findOne();

      if (!pricing) {
        throw new GraphQLError("Pricing content hasn't been added yet.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      pricing.set(cleanPricingInput(input));
      await pricing.save();
      return pricing;
    },
  },
};
