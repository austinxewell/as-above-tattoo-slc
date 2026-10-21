export const siteSettingsTypeDefs = /* GraphQL */ `
  type PublishingStandards {
    photo: Boolean!
    bio: Boolean!
    statement: Boolean!
    instagram: Boolean!
    booking: Boolean!
    minSpecialties: Int!
    minPieces: Int!
  }

  type SiteSettings {
    bookingRequestsEnabled: Boolean!
    publishing: PublishingStandards!
  }

  input PublishingStandardsInput {
    photo: Boolean
    bio: Boolean
    statement: Boolean
    instagram: Boolean
    booking: Boolean
    minSpecialties: Int
    minPieces: Int
  }

  input SiteSettingsInput {
    bookingRequestsEnabled: Boolean
    publishing: PublishingStandardsInput
  }

  extend type Query {
    siteSettings: SiteSettings!
  }

  extend type Mutation {
    updateSiteSettings(input: SiteSettingsInput!): SiteSettings!
  }
`;
