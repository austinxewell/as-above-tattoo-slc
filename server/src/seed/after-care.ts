import { AfterCareModel } from "../models/after-care.js";
import { afterCare } from "./data/after-care.js";

export async function seedAfterCare() {
  await AfterCareModel.findOneAndUpdate(
    {},
    {
      intro: afterCare.intro,
      disclaimer: afterCare.disclaimer,
      methods: afterCare.methods,
      dos: afterCare.dos,
      donts: afterCare.donts,
      warningSigns: afterCare.warningSigns,
    },
    { upsert: true, runValidators: true },
  );
}
