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
  }
`;
