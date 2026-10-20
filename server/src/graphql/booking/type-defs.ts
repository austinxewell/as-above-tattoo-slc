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

  enum BookingActivityType {
    note
    event
  }

  type BookingActivity {
    id: ID!
    type: BookingActivityType!
    text: String!
    authorName: String!
    createdAt: String!
  }

  type BookingRequest {
    id: ID!
    artist: Artist
    formerArtistName: String
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
    activity: [BookingActivity!]!
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
    statuses: [BookingStatus!]
    assignment: String
    search: String
  }

  extend type Mutation {
    requestBooking(input: BookingRequestInput!): ID!
    updateBookingStatus(ids: [ID!]!, status: BookingStatus!, assignTo: String): Int!
    archiveBookings(ids: [ID!]!): Int!
    unarchiveBookings(ids: [ID!]!): Int!
    deleteBookings(ids: [ID!]!): Int!
    addBookingNote(id: ID!, text: String!): BookingActivity!
  }

  extend type Query {
    bookingRequestsEnabled: Boolean!
    bookingPage(filter: BookingFilter, page: Int, pageSize: Int): BookingPage!
    bookingCounts(filter: BookingFilter): BookingCounts!
    booking(id: ID!): BookingRequest
  }
`;
