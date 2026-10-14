export const artistTypeDefs = /* GraphQL */ `
  type ArtistBooking {
    minimum: String!
    rate: String!
    deposit: String!
    availability: String!
    notes: [String!]!
  }

  type Artist {
    id: ID!
    slug: String!
    name: String!
    specialties: [String!]!
    bio: String!
    statement: String!
    imgUrl: String!
    instagram: String
    isBooking: Boolean!
    booking: ArtistBooking!
  }

  extend type Query {
    artists: [Artist!]!
    artist(slug: String!): Artist
  }
`;
