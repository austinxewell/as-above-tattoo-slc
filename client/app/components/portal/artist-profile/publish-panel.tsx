import { useFetcher } from "react-router";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import type { ProfileActionResult, PublishChecklistItem } from "~/lib/artist-profile";

type PublishPanelProps = {
  isPublished: boolean;
  checklist: PublishChecklistItem[];
  canUnpublish: boolean;
};

export function PublishPanel({ isPublished, checklist, canUnpublish }: PublishPanelProps) {
  const fetcher = useFetcher<ProfileActionResult>();
  const pendingIntent = fetcher.state !== "idle" ? fetcher.formData?.get("intent") : null;
  const error =
    fetcher.state === "idle" && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const missing = checklist.filter((item) => !item.done);
  const isReady = missing.length === 0;

  const actions = (
    <fetcher.Form method="post" className="flex shrink-0 gap-2">
      {!isPublished && (
        <Button
          type="submit"
          name="intent"
          value="publish"
          variant="brand"
          size="sm"
          disabled={!isReady || pendingIntent != null}
        >
          {pendingIntent === "publish" ? "Publishing…" : "Publish to site"}
        </Button>
      )}
      {isPublished && canUnpublish && (
        <Button
          type="submit"
          name="intent"
          value="unpublish"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={pendingIntent != null}
        >
          {pendingIntent === "unpublish" ? "Unpublishing…" : "Unpublish"}
        </Button>
      )}
    </fetcher.Form>
  );

  const errorMessage = error && (
    <p role="alert" className="mt-3 text-sm text-destructive">
      {error}
    </p>
  );

  if (isPublished && isReady) {
    return (
      <section aria-labelledby="publish-heading" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="publish-heading" className="font-display text-xl uppercase text-accent">
            Published
          </h2>
          {actions}
        </div>
        {errorMessage}
      </section>
    );
  }

  const status = isPublished
    ? {
        title: "Published, needs attention",
        text: "It stays live, but no longer meets the shop's publishing standards.",
      }
    : isReady
      ? { title: "Ready to publish", text: "Everything on the checklist is done." }
      : {
          title: "Draft",
          text: `${missing.length} ${missing.length === 1 ? "item" : "items"} left before this page can be published.`,
        };

  return (
    <section aria-labelledby="publish-heading" className="mt-8 border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="publish-heading"
            className={cn("font-display text-xl uppercase", isPublished && "text-accent")}
          >
            {status.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{status.text}</p>
        </div>

        {actions}
      </div>

      {errorMessage}

      {checklist.length > 0 && (
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-3">
          {checklist.map((item) => (
            <li key={item.key} className="flex items-start gap-2.5 text-sm">
              {item.done ? (
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center bg-accent text-accent-foreground">
                  <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                </span>
              ) : (
                <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 border border-accent" />
              )}
              <span className="min-w-0">
                <span className={item.done ? "text-muted-foreground" : undefined}>
                  {item.label}
                </span>
                <span className="sr-only">{item.done ? " (done)" : " (not done yet)"}</span>
                {item.detail && (
                  <span className="block text-xs text-muted-foreground">{item.detail}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
