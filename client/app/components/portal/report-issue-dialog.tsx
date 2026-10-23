import { useId } from "react";
import { useFetcher, useLocation } from "react-router";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import type { IssueReportResult } from "~/lib/issue-report";

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";

// Lives inside DialogContent, so it mounts fresh (empty fields, new fetcher) each time the dialog opens.
function ReportIssueForm({ onClose }: { onClose: () => void }) {
  const fetcher = useFetcher<IssueReportResult>();
  const { pathname, search } = useLocation();
  const id = useId();
  const isSending = fetcher.state !== "idle";
  const result = fetcher.state === "idle" ? fetcher.data : undefined;

  if (result?.ok) {
    return (
      <div className="grid gap-4">
        <p role="status" className="flex items-center gap-2 text-success">
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          Thanks, your report was sent.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          If we need more details, we'll reply to your email.
        </p>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/portal/report-issue" className="grid gap-5">
      <input type="hidden" name="page" value={`${pathname}${search}`} />
      <input type="hidden" name="userAgent" value={navigator.userAgent} />

      <div className="grid gap-2">
        <label htmlFor={`${id}-what`} className={labelClasses}>
          What happened?
        </label>
        <textarea
          id={`${id}-what`}
          name="what"
          required
          rows={4}
          maxLength={2000}
          autoFocus
          placeholder="e.g. I clicked Save on a booking and nothing changed."
          className={cn(controlClasses, "resize-y text-sm leading-6")}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${id}-expected`} className={labelClasses}>
          What did you expect?{" "}
          <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id={`${id}-expected`}
          name="expected"
          rows={2}
          maxLength={1000}
          className={cn(controlClasses, "resize-y text-sm leading-6")}
        />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        The page you're on and your browser are included automatically.
      </p>

      {result?.error && (
        <p role="alert" className="text-sm text-destructive">
          {result.error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="brand" size="sm" disabled={isSending}>
          {isSending ? "Sending" : "Send report"}
          {isSending && (
            <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.5} aria-hidden="true" />
          )}
        </Button>
      </div>
    </fetcher.Form>
  );
}

type ReportIssueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReportIssueDialog({ open, onOpenChange }: ReportIssueDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-border bg-background">
        <DialogTitle className="font-display text-2xl uppercase">Report an issue</DialogTitle>
        <DialogDescription className="leading-6 text-muted-foreground">
          Something broken or confusing? Tell us what happened and we'll look into it.
        </DialogDescription>

        <ReportIssueForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
