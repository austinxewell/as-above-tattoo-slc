import { useId, useState } from "react";
import { useFetcher } from "react-router";
import { cn } from "cn";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import type { BookingActionResult } from "~/lib/bookings";

const MAX_NOTE_LENGTH = 2000;
const WARN_AT = 1800;

export function NoteForm() {
  const fetcher = useFetcher<BookingActionResult>();
  const [text, setText] = useState("");
  const id = useId();
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error ?? null;

  const [handledData, setHandledData] = useState(fetcher.data);

  if (fetcher.data !== handledData) {
    setHandledData(fetcher.data);

    if (fetcher.data && !fetcher.data.error) {
      setText("");
    }
  }

  return (
    <fetcher.Form method="post" className="border-t border-border p-4">
      <input type="hidden" name="intent" value="note" />

      <label htmlFor={`${id}-text`} className="sr-only">
        Add a note
      </label>
      <textarea
        id={`${id}-text`}
        name="text"
        rows={3}
        required
        maxLength={MAX_NOTE_LENGTH}
        placeholder="Write a note…"
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint ${id}-count`}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        className={cn(controlClasses, "min-h-20 resize-y text-sm leading-6")}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p
          id={`${id}-hint`}
          aria-live="polite"
          className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}
        >
          {error ?? "Staff only. Clients never see notes."}
        </p>

        <div className="ml-auto flex items-center gap-3">
          <span
            id={`${id}-count`}
            className={cn(
              "text-xs tabular-nums",
              text.length >= WARN_AT ? "text-accent" : "text-muted-foreground",
            )}
          >
            {text.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}
          </span>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving…" : "Add note"}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}
