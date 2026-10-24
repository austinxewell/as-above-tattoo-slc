export const imageUploadTypeDefs = /* GraphQL */ `
  enum ImageKind {
    PORTFOLIO
    PROFILE
  }

  type ImageUpload {
    token: String!
    expire: Int!
    signature: String!
    publicKey: String!
    folder: String!
  }

  extend type Mutation {
    createImageUpload(artist: String!, kind: ImageKind!): ImageUpload!
  }
`;
