export const bookingTypeDefs = /* GraphQL */ `
  enum BookingSize {
    small
    medium
    large
    project
  }

  enum BookingStatus {
    new
    contacted
    scheduled
    declined
  }

  type BookingRequest {
    id: ID!
    artist: Artist
    name: String!
    email: String!
    phone: String
    placement: String!
    size: BookingSize!
    budget: String
    idea: String!
    availability: String
    status: BookingStatus!
    archivedAt: String
    createdAt: String!
  }

  type BookingPage {
    items: [BookingRequest!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  type StatusCount {
    status: BookingStatus!
    count: Int!
  }

  type ArtistCount {
    slug: String
    count: Int!
  }

  type BookingCounts {
    active: Int!
    archived: Int!
    byStatus: [StatusCount!]!
    statusTotal: Int!
    byArtist: [ArtistCount!]!
    artistTotal: Int!
  }

  input BookingRequestInput {
    artist: String
    name: String!
    email: String!
    phone: String
    placement: String!
    size: BookingSize!
    budget: String
    idea: String!
    availability: String
    website: String
  }

  input BookingFilter {
    mine: Boolean
    archived: Boolean
    status: BookingStatus
    assignment: String
    search: String
  }

  extend type Mutation {
    requestBooking(input: BookingRequestInput!): ID!
    updateBookingStatus(ids: [ID!]!, status: BookingStatus!, assignTo: String): Int!
    archiveBookings(ids: [ID!]!): Int!
    unarchiveBookings(ids: [ID!]!): Int!
    deleteBookings(ids: [ID!]!): Int!
  }

  extend type Query {
    bookingRequestsEnabled: Boolean!
    bookingPage(filter: BookingFilter, page: Int, pageSize: Int): BookingPage!
    bookingCounts(filter: BookingFilter): BookingCounts!
    booking(id: ID!): BookingRequest
  }
`;
