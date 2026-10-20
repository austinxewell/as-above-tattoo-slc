export const userTypeDefs = /* GraphQL */ `
  type StaffUser {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    artist: Artist
    hasPassword: Boolean!
  }

  input CreateUserInput {
    name: String!
    email: String!
    role: UserRole!
    withArtistProfile: Boolean!
  }

  extend type Query {
    users: [StaffUser!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): StaffUser!
    addArtistProfile(userId: ID!): StaffUser!
    sendInvite(userId: ID!): Boolean!
  }
`;
