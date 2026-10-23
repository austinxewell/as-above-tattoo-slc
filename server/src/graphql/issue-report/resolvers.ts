import { GraphQLError } from "graphql";
import { requireUser } from "../../auth/guards.js";
import { sendEmail } from "../../email/send-email.js";
import { issueReportEmail } from "../../email/issue-report-email.js";
import { createRateLimiter } from "../../security/rate-limit.js";
import type { GraphQLContext } from "../context.js";
import { invalid, requiredText } from "../validate.js";

type IssueReportInput = {
  what: string;
  expected?: string | null;
  page: string;
  userAgent?: string | null;
};

const isRateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 });

const reportedAtFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver",
  dateStyle: "medium",
  timeStyle: "short",
});

export const issueReportResolvers = {
  Mutation: {
    reportIssue: async (
      _parent: unknown,
      { input }: { input: IssueReportInput },
      context: GraphQLContext,
    ) => {
      const user = requireUser(context);
      const to = process.env.ISSUE_REPORT_EMAIL;

      if (!to) {
        console.error("reportIssue: ISSUE_REPORT_EMAIL is not set.");
        throw new GraphQLError("Issue reports aren't set up yet. Please tell an admin directly.");
      }

      const what = requiredText("what", "What happened", input.what, 2000);
      const expected = (input.expected ?? "").trim();
      if (expected.length > 1000) {
        invalid("expected", "What you expected must be 1000 characters or fewer.");
      }

      // Only paths inside this site, so the link in the email can't point anywhere else.
      const page = input.page.trim();
      if (!page.startsWith("/") || page.startsWith("//") || page.length > 500) {
        invalid("page", "That page address isn't valid.");
      }

      if (isRateLimited(user.id)) {
        throw new GraphQLError("You've sent a lot of reports this hour. Please try again later.");
      }

      await sendEmail({
        to: [to],
        replyTo: user.email,
        ...issueReportEmail({
          name: user.name,
          email: user.email,
          role: user.role,
          what,
          expected: expected || undefined,
          pageUrl: `${process.env.CLIENT_URL}${page}`,
          userAgent: (input.userAgent ?? "").slice(0, 400),
          reportedAt: `${reportedAtFormat.format(new Date())} (Salt Lake time)`,
        }),
      });

      return true;
    },
  },
};
