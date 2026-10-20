import { Link, useFetcher } from "react-router";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { roleLabels, type StaffActionResult, type StaffMember } from "~/lib/staff";
import { Button } from "~/components/ui/button";
import { StatusDot } from "~/components/portal/status-dot";

export const staffColumns =
  "md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.3fr)]";

const cellClasses = "flex items-center justify-between gap-4 md:block";
const labelClasses = "text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground md:sr-only";

const successMessages: Record<string, string> = {
  invite: "Invite sent.",
  "add-profile": "Artist profile added. It's a draft until it's published.",
};

export function StaffRow({ member }: { member: StaffMember }) {
  const fetcher = useFetcher<StaffActionResult>();
  const busyIntent = fetcher.state !== "idle" ? fetcher.formData?.get("intent") : null;
  const result = fetcher.state === "idle" ? fetcher.data : undefined;

  return (
    <li className="border-b border-border py-4">
      <div className={cn("grid gap-3 md:items-center md:gap-6", staffColumns)}>
        <div className="min-w-0">
          <p className="truncate font-medium">{member.name}</p>
          <p className="truncate text-sm text-muted-foreground">{member.email}</p>
        </div>

        <div className={cellClasses}>
          <span className={labelClasses}>Role</span>
          <span className="text-sm">{roleLabels[member.role]}</span>
        </div>

        <div className={cellClasses}>
          <span className={labelClasses}>Login</span>
          {member.hasPassword ? (
            <StatusDot tone="success">Active</StatusDot>
          ) : (
            <StatusDot tone="accent">Invite pending</StatusDot>
          )}
        </div>

        <div className={cellClasses}>
          <span className={labelClasses}>Artist profile</span>
          {member.artist ? (
            <Link
              to={`/portal/admin/artists/${member.artist.slug}`}
              className="underline-offset-4 hover:underline"
            >
              <StatusDot tone={member.artist.isPublished ? "success" : "muted"}>
                {member.artist.isPublished ? "Published" : "Draft"}
              </StatusDot>
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>

        <fetcher.Form method="post" className="flex flex-wrap gap-2 md:justify-end">
          <input type="hidden" name="userId" value={member.id} />

          {!member.hasPassword && (
            <Button
              type="submit"
              name="intent"
              value="invite"
              variant="outline"
              size="sm"
              className="rounded-none"
              disabled={busyIntent != null}
            >
              {busyIntent === "invite" ? "Sending" : "Send invite"}
              {busyIntent === "invite" && (
                <LoaderCircle
                  className="size-3.5 animate-spin"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
            </Button>
          )}

          {!member.artist && (
            <Button
              type="submit"
              name="intent"
              value="add-profile"
              variant="outline"
              size="sm"
              className="rounded-none"
              disabled={busyIntent != null}
            >
              {busyIntent === "add-profile" ? "Adding" : "Add artist profile"}
              {busyIntent === "add-profile" && (
                <LoaderCircle
                  className="size-3.5 animate-spin"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
            </Button>
          )}
        </fetcher.Form>
      </div>

      {result && (
        <p role="status" className="mt-3 text-sm">
          {result.ok ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {successMessages[result.intent]}
            </span>
          ) : (
            <span className="text-destructive">{result.error}</span>
          )}
        </p>
      )}
    </li>
  );
}
