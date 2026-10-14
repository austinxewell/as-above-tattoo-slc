import { createSchema } from "graphql-yoga";

import { aboutTypeDefs } from "./about/type-defs.js";
import { artistTypeDefs } from "./artist/type-defs.js";
import { pieceTypeDefs } from "./piece/type-defs.js";
import { bookingContentTypeDefs } from "./booking-content/type-defs.js";
import { pricingTypeDefs } from "./pricing/type-defs.js";
import { afterCareTypeDefs } from "./after-care/type-defs.js";

import { aboutResolvers } from "./about/resolvers.js";
import { artistResolvers } from "./artist/resolvers.js";
import { pieceResolvers } from "./piece/resolvers.js";
import { bookingContentResolvers } from "./booking-content/resolvers.js";
import { pricingResolvers } from "./pricing/resolvers.js";
import { afterCareResolvers } from "./after-care/resolvers.js";

const baseTypeDefs = /* GraphQL */ `
  type Query
`;

export const schema = createSchema({
  typeDefs: [
    baseTypeDefs,
    aboutTypeDefs,
    artistTypeDefs,
    pieceTypeDefs,
    bookingContentTypeDefs,
    pricingTypeDefs,
    afterCareTypeDefs,
  ],
  resolvers: [
    aboutResolvers,
    artistResolvers,
    pieceResolvers,
    bookingContentResolvers,
    pricingResolvers,
    afterCareResolvers,
  ],
});
