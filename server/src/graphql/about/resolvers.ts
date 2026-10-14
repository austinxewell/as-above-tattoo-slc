import { AboutModel } from "../../models/about.js";

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
};
