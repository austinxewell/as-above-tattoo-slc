export const pricingTypeDefs = /* GraphQL */ `
  type PricingFactorAndPolicyValue {
    id: ID!
    title: String!
    description: String!
  }

  type PricingFaqValue {
    id: ID!
    question: String!
    answer: String!
  }

  type Pricing {
    intro: String!
    shopMinimum: String!
    factors: [PricingFactorAndPolicyValue!]!
    policies: [PricingFactorAndPolicyValue!]!
    faqs: [PricingFaqValue!]!
  }

  input PricingTitledInput {
    title: String!
    description: String!
  }

  input PricingFaqInput {
    question: String!
    answer: String!
  }

  input PricingInput {
    intro: String
    shopMinimum: String
    factors: [PricingTitledInput!]
    policies: [PricingTitledInput!]
    faqs: [PricingFaqInput!]
  }

  extend type Query {
    pricing: Pricing!
  }

  extend type Mutation {
    updatePricing(input: PricingInput!): Pricing!
  }
`;
