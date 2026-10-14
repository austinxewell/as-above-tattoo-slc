import { createSchema } from "graphql-yoga";
import { aboutTypeDefs } from "./about/type-defs.js";
import { aboutResolvers } from "./about/resolvers.js";

const baseTypeDefs = /* GraphQL */ `
  type Query
`;

export const schema = createSchema({
  typeDefs: [baseTypeDefs, aboutTypeDefs],
  resolvers: [aboutResolvers],
});
