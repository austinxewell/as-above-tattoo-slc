import { createSchema } from "graphql-yoga";
import type { GraphQLContext } from "./context.js";

import { aboutTypeDefs } from "./about/type-defs.js";
import { artistTypeDefs } from "./artist/type-defs.js";
import { pieceTypeDefs } from "./piece/type-defs.js";
import { bookingContentTypeDefs } from "./booking-content/type-defs.js";
import { bookingTypeDefs } from "./booking/type-defs.js";
import { pricingTypeDefs } from "./pricing/type-defs.js";
import { afterCareTypeDefs } from "./after-care/type-defs.js";
import { authTypeDefs } from "./auth/type-defs.js";
import { userTypeDefs } from "./user/type-defs.js";
import { siteSettingsTypeDefs } from "./site-settings/type-defs.js";
import { issueReportTypeDefs } from "./issue-report/type-defs.js";
import { imageUploadTypeDefs } from "./image-upload/type-defs.js";

import { aboutResolvers } from "./about/resolvers.js";
import { artistResolvers } from "./artist/resolvers.js";
import { pieceResolvers } from "./piece/resolvers.js";
import { bookingContentResolvers } from "./booking-content/resolvers.js";
import { bookingResolvers } from "./booking/resolvers.js";
import { pricingResolvers } from "./pricing/resolvers.js";
import { afterCareResolvers } from "./after-care/resolvers.js";
import { authResolvers } from "./auth/resolvers.js";
import { userResolvers } from "./user/resolvers.js";
import { siteSettingsResolvers } from "./site-settings/resolvers.js";
import { issueReportResolvers } from "./issue-report/resolvers.js";
import { imageUploadResolvers } from "./image-upload/resolvers.js";

const baseTypeDefs = /* GraphQL */ `
  type Query
  type Mutation
`;

export const schema = createSchema<GraphQLContext>({
  typeDefs: [
    baseTypeDefs,
    aboutTypeDefs,
    artistTypeDefs,
    pieceTypeDefs,
    bookingContentTypeDefs,
    bookingTypeDefs,
    pricingTypeDefs,
    afterCareTypeDefs,
    authTypeDefs,
    userTypeDefs,
    siteSettingsTypeDefs,
    issueReportTypeDefs,
    imageUploadTypeDefs,
  ],
  resolvers: [
    aboutResolvers,
    artistResolvers,
    pieceResolvers,
    bookingContentResolvers,
    bookingResolvers,
    pricingResolvers,
    afterCareResolvers,
    authResolvers,
    userResolvers,
    siteSettingsResolvers,
    issueReportResolvers,
    imageUploadResolvers,
  ],
});
