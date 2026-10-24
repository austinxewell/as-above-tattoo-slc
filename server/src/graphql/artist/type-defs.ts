export const artistTypeDefs = /* GraphQL */ `
  type ArtistBooking {
    minimum: String!
    rate: String!
    deposit: String!
    availability: String!
    notes: [String!]!
  }

  type PublishChecklistItem {
    key: String!
    label: String!
    done: Boolean!
    detail: String
    current: Int
    goal: Int
  }

  enum MoveDirection {
    up
    down
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
    isPublished: Boolean!
    booking: ArtistBooking!
    pieceCount: Int!
    publishChecklist: [PublishChecklistItem!]!
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
    fileId: String
    isBooking: Boolean
    booking: ArtistBookingInput
  }

  extend type Mutation {
    updateArtist(slug: String!, input: ArtistUpdateInput!): Artist!
    publishArtist(slug: String!): Artist!
    unpublishArtist(slug: String!): Artist!
    moveArtist(slug: String!, direction: MoveDirection!): [Artist!]!
  }

  extend type Query {
    artists(includeUnpublished: Boolean): [Artist!]!
    artist(slug: String!): Artist
  }
`;
