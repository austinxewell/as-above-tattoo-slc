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

  extend type Query {
    bookingContent: BookingContent!
  }
`;
