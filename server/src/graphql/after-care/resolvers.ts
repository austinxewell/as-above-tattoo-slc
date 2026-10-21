import { GraphQLError } from "graphql";
import { AfterCareModel } from "../../models/after-care.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanAfterCareInput, type AfterCareInput } from "./validate.js";

export const afterCareResolvers = {
  Query: {
    afterCare: async () => {
      const afterCare = await AfterCareModel.findOne();

      if (!afterCare) {
        throw new Error("After care content hasn't been added yet. Run the seed script.");
      }

      return afterCare;
    },
  },
  Mutation: {
    updateAfterCare: async (
      _parent: unknown,
      { input }: { input: AfterCareInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const afterCare = await AfterCareModel.findOne();

      if (!afterCare) {
        throw new GraphQLError("After care content hasn't been added yet.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      afterCare.set(cleanAfterCareInput(input));
      await afterCare.save();
      return afterCare;
    },
  },
};
