import { useFetcher } from "react-router";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ProfileActionResult } from "~/lib/artist-profile";

const optionClasses =
  "px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-colors aria-pressed:bg-accent aria-pressed:text-accent-foreground";

export function BooksToggle({ isBooking }: { isBooking: boolean }) {
  const fetcher = useFetcher<ProfileActionResult>();
  const pending = fetcher.formData?.get("isBooking");
  const shownOpen = pending != null ? pending === "true" : isBooking;
  const isSaving = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" className="grid justify-items-start gap-2">
      <input type="hidden" name="intent" value="books" />

      <div
        role="group"
        aria-label="Taking bookings"
        className="grid grid-cols-2 border border-border"
      >
        <button
          type="submit"
          name="isBooking"
          value="true"
          aria-pressed={shownOpen}
          className={cn(optionClasses, !shownOpen && "text-muted-foreground hover:text-accent")}
        >
          Open
        </button>
        <button
          type="submit"
          name="isBooking"
          value="false"
          aria-pressed={!shownOpen}
          className={cn(optionClasses, shownOpen && "text-muted-foreground hover:text-accent")}
        >
          Closed
        </button>
      </div>

      <p role="status" className="min-h-5 text-xs text-muted-foreground">
        {isSaving ? (
          "Saving…"
        ) : fetcher.data?.error ? (
          <span className="text-destructive">{fetcher.data.error}</span>
        ) : fetcher.data?.ok ? (
          <span className="inline-flex items-center gap-1 text-success">
            <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Saved
          </span>
        ) : shownOpen ? (
          "Clients can request you on the booking page."
        ) : (
          "You're disabled from new booking requests."
        )}
      </p>
    </fetcher.Form>
  );
}
