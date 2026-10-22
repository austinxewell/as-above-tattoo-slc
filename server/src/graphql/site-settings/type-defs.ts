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

  enum Weekday {
    monday
    tuesday
    wednesday
    thursday
    friday
    saturday
    sunday
  }

  type ShopHours {
    day: Weekday!
    isOpen: Boolean!
    opensAt: String!
    closesAt: String!
  }

  type ShopDetails {
    street: String!
    city: String!
    state: String!
    zip: String!
    phone: String!
    email: String
    instagram: String!
    facebook: String!
    hours: [ShopHours!]!
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

  input ShopHoursInput {
    day: Weekday!
    isOpen: Boolean!
    opensAt: String
    closesAt: String
  }

  input ShopDetailsInput {
    street: String
    city: String
    state: String
    zip: String
    phone: String
    email: String
    instagram: String
    facebook: String
    hours: [ShopHoursInput!]
  }

  extend type Query {
    siteSettings: SiteSettings!
    shopDetails: ShopDetails!
  }

  extend type Mutation {
    updateSiteSettings(input: SiteSettingsInput!): SiteSettings!
    updateShopDetails(input: ShopDetailsInput!): ShopDetails!
  }
`;
