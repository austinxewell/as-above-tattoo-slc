import { GraphQLError } from "graphql";
import { AboutModel } from "../../models/about.js";
import { requireRole } from "../../auth/guards.js";
import type { GraphQLContext } from "../context.js";
import { cleanAboutInput, type AboutInput } from "./validate.js";

export const aboutResolvers = {
  Query: {
    about: async () => {
      const about = await AboutModel.findOne();

      if (!about) {
        throw new Error("About content hasn't been added yet. Run the seed script.");
      }

      return about;
    },
  },
  Mutation: {
    updateAbout: async (
      _parent: unknown,
      { input }: { input: AboutInput },
      context: GraphQLContext,
    ) => {
      requireRole(context, "admin");

      const about = await AboutModel.findOne();

      if (!about) {
        throw new GraphQLError("About content hasn't been added yet.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      about.set(cleanAboutInput(input));
      await about.save();
      return about;
    },
  },
};
