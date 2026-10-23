import { graphqlRequest } from "~/lib/graphql";

const REPORT_ISSUE_MUTATION = /* GraphQL */ `
  mutation ReportIssue($input: IssueReportInput!) {
    reportIssue(input: $input)
  }
`;

export type IssueReportResult = { ok: boolean; error: string | null };

export async function handleIssueReportAction(request: Request): Promise<IssueReportResult> {
  const formData = await request.formData();
  const text = (name: string) => String(formData.get(name) ?? "");

  try {
    await graphqlRequest(
      REPORT_ISSUE_MUTATION,
      {
        input: {
          what: text("what"),
          expected: text("expected"),
          page: text("page"),
          userAgent: text("userAgent"),
        },
      },
      request.signal,
    );
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }
}
