import { AfterCareModel } from "../../models/after-care.js";

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
};
