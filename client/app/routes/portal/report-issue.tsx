import { redirect } from "react-router";
import type { Route } from "./+types/report-issue";
import { handleIssueReportAction } from "~/lib/issue-report";

// Action-only route: the Report an issue dialog posts here from any portal page.
export function clientLoader() {
  throw redirect("/portal");
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleIssueReportAction(request);
}
