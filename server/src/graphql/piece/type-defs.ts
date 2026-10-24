export const pieceTypeDefs = /* GraphQL */ `
  type Piece {
    id: ID!
    imgUrl: String!
    style: String!
    tags: [String!]!
    artist: Artist!
    isFeatured: Boolean!
  }

  type PiecePage {
    items: [Piece!]!
    nextCursor: String
  }

  input PieceInput {
    "ImageKit file ID from an upload. Required when creating; leave out when updating to keep the current image."
    fileId: String
    style: String!
    tags: [String!]!
  }

  extend type Query {
    pieces(
      artist: String
      style: String
      search: String
      first: Int = 12
      after: String
      featured: Boolean
    ): PiecePage!
    pieceStyles: [String!]!
    portfolioPieces(
      mine: Boolean
      artist: String
      style: String
      search: String
      first: Int = 12
      after: String
    ): PiecePage!
    portfolioStyles(mine: Boolean, shopWide: Boolean): [String!]!
  }

  extend type Mutation {
    createPiece(artist: String!, input: PieceInput!): Piece!
    updatePiece(id: ID!, input: PieceInput!): Piece!
    setPieceFeatured(id: ID!, featured: Boolean!): Piece!
    deletePiece(id: ID!): Boolean!
  }
`;
