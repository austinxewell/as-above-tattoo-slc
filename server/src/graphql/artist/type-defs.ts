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

  input ArtistBookingInput {
    minimum: String!
    rate: String!
    deposit: String!
    availability: String!
    notes: [String!]!
  }

  input ArtistUpdateInput {
    name: String
    bio: String
    statement: String
    specialties: [String!]
    instagram: String
    imgUrl: String
    isBooking: Boolean
    booking: ArtistBookingInput
  }

  extend type Mutation {
    updateArtist(slug: String!, input: ArtistUpdateInput!): Artist!
  }

  extend type Query {
    artists: [Artist!]!
    artist(slug: String!): Artist
  }
`;
