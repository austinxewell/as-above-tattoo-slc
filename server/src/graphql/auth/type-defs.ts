export const authTypeDefs = /* GraphQL */ `
  enum UserRole {
    admin
    artist
  }

  type CurrentUser {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    artist: Artist
  }

  extend type Query {
    me: CurrentUser
  }

  extend type Mutation {
    login(email: String!, password: String!): CurrentUser!
    logout: Boolean!
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, newPassword: String!): Boolean!
  }
`;
