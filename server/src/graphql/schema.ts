import { createSchema } from "graphql-yoga";

import { aboutTypeDefs } from "./about/type-defs.js";
import { artistTypeDefs } from "./artist/type-defs.js";

import { aboutResolvers } from "./about/resolvers.js";
import { artistResolvers } from "./artist/resolvers.js";

const baseTypeDefs = /* GraphQL */ `
  type Query
`;

export const schema = createSchema({
  typeDefs: [baseTypeDefs, aboutTypeDefs, artistTypeDefs],
  resolvers: [aboutResolvers, artistResolvers],
});
