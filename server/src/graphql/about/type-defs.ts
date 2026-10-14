export const aboutTypeDefs = /* GraphQL */ `
  type AboutValue {
    id: ID!
    title: String!
    description: String!
  }

  type About {
    heading: String!
    body: String!
    values: [AboutValue!]!
  }

  extend type Query {
    about: About!
  }
`;
