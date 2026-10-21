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

  input AboutValueInput {
    title: String!
    description: String!
  }

  input AboutInput {
    heading: String
    body: String
    values: [AboutValueInput!]
  }

  extend type Query {
    about: About!
  }

  extend type Mutation {
    updateAbout(input: AboutInput!): About!
  }
`;
