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

  extend type Mutation {
    requestBooking(input: BookingRequestInput!): ID!
    updateBookingStatus(ids: [ID!]!, status: BookingStatus!, assignTo: String): Int!
    archiveBookings(ids: [ID!]!): Int!
    unarchiveBookings(ids: [ID!]!): Int!
    deleteBookings(ids: [ID!]!): Int!
  }

  extend type Query {
    bookingRequestsEnabled: Boolean!
    bookings(mine: Boolean, archived: Boolean): [BookingRequest!]!
    booking(id: ID!): BookingRequest
  }
`;
