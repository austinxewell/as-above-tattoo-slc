import { about } from "../../data/about.js";

export const aboutResolvers = {
  Query: {
    about: () => about,
  },
};
