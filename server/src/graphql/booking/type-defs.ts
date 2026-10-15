export const bookingTypeDefs = /* GraphQL */ `
  enum BookingSize {
    small
    medium
    large
    project
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
  }

  extend type Query {
    bookingRequestsEnabled: Boolean!
  }
`;
