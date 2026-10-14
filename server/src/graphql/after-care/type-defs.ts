export const afterCareTypeDefs = /* GraphQL */ `
  type MethodStageValue {
    id: ID!
    timeframe: String!
    title: String!
    steps: [String!]!
  }

  type AfterCareMethodValue {
    id: ID!
    slug: String!
    name: String!
    description: String!
    stages: [MethodStageValue!]!
  }

  type AfterCare {
    intro: String!
    disclaimer: String!
    methods: [AfterCareMethodValue!]!
    dos: [String!]!
    donts: [String!]!
    warningSigns: [String!]!
  }

  extend type Query {
    afterCare: AfterCare!
  }
`;
