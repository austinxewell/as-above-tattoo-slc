import { AboutModel } from "../models/about.js";
import { about } from "./data/about.js";

export async function seedAbout() {
  await AboutModel.findOneAndUpdate(
    {},
    {
      heading: about.heading,
      body: about.body,
      values: about.values.map(({ title, description }) => ({ title, description })),
    },
    { upsert: true, runValidators: true },
  );
}
