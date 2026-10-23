export const issueReportTypeDefs = /* GraphQL */ `
  input IssueReportInput {
    what: String!
    expected: String
    page: String!
    userAgent: String
  }

  extend type Mutation {
    reportIssue(input: IssueReportInput!): Boolean!
  }
`;
