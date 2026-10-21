export const bookingContentTypeDefs = /* GraphQL */ `
  type BookingContentValue {
    id: ID!
    title: String!
    description: String!
  }

  type BookingContent {
    intro: String!
    steps: [BookingContentValue!]!
    whyRequest: String!
    disclaimer: String!
  }

  input BookingContentStepInput {
    title: String!
    description: String!
  }

  input BookingContentInput {
    intro: String
    steps: [BookingContentStepInput!]
    whyRequest: String
    disclaimer: String
  }

  extend type Query {
    bookingContent: BookingContent!
  }

  extend type Mutation {
    updateBookingContent(input: BookingContentInput!): BookingContent!
  }
`;
