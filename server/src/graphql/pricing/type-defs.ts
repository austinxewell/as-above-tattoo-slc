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

  extend type Query {
    pricing: Pricing!
  }
`;
