import { useId, useState } from "react";
import { useFetcher, useLocation } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { BookingActionResult, BookingSession, BookingWithActivity } from "~/lib/bookings";
import { sessionEvent } from "~/lib/calendar";
import { AddToCalendar } from "./add-to-calendar";
import { DateField } from "./date-field";
import { TimeField } from "./time-field";

const labelClasses = "text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground";
const triggerClasses =
  "w-full rounded-none border-border bg-background px-3 py-2.5 text-base data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0";

const dayFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours} hr`, rest && `${rest} min`].filter(Boolean).join(" ");
}

const durationItems = [30, 60, 90, 120, 180, 240, 300, 360, 480].map((minutes) => ({
  value: String(minutes),
  label: formatDuration(minutes),
}));

function SessionRow({
  booking,
  session,
  canManage,
}: {
  booking: BookingWithActivity;
  session: BookingSession;
  canManage: boolean;
}) {
  const fetcher = useFetcher<BookingActionResult>();
  const [isConfirming, setIsConfirming] = useState(false);
  const start = new Date(session.startsAt);
  const end = new Date(start.getTime() + session.durationMinutes * 60_000);
  const { pathname } = useLocation();
  const event = sessionEvent(booking, session, `${window.location.origin}${pathname}`);
  const isRemoving = fetcher.state !== "idle";
  const error = fetcher.state === "idle" ? fetcher.data?.error : null;

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div>
        <p className="font-medium">{dayFormat.format(start)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {timeFormat.formatRange(start, end)} · {formatDuration(session.durationMinutes)}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AddToCalendar event={event} filename={`tattoo-${start.toLocaleDateString("en-CA")}.ics`} />

        {canManage && (
          <fetcher.Form method="post" className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="intent" value="removeSession" />
            <input type="hidden" name="sessionId" value={session.id} />
            {isConfirming ? (
              <>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  className="rounded-none"
                  disabled={isRemoving}
                >
                  {isRemoving ? "Removing…" : "Remove session"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => setIsConfirming(false)}
                >
                  Keep it
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none text-muted-foreground hover:text-destructive"
                onClick={() => setIsConfirming(true)}
              >
                Remove…
              </Button>
            )}
          </fetcher.Form>
        )}
      </div>
    </li>
  );
}

type SessionsPanelProps = {
  booking: BookingWithActivity;
  canManage: boolean;
  hint?: string;
};

export function SessionsPanel({ booking, canManage, hint }: SessionsPanelProps) {
  const { sessions } = booking;
  const fetcher = useFetcher<BookingActionResult>();
  const [isAdding, setIsAdding] = useState(false);
  const [handledData, setHandledData] = useState(fetcher.data);
  const id = useId();
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.state === "idle" ? (fetcher.data?.error ?? null) : null;

  if (fetcher.data !== handledData) {
    setHandledData(fetcher.data);
    if (fetcher.data && !fetcher.data.error) setIsAdding(false);
  }

  return (
    <section className="mt-8" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        Sessions
      </h2>

      {sessions.length > 0 ? (
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              booking={booking}
              session={session}
              canManage={canManage}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No sessions booked yet.</p>
      )}

      {hint && <p className="mt-3 text-sm text-muted-foreground">{hint}</p>}

      {canManage &&
        (isAdding ? (
          <fetcher.Form
            method="post"
            className="mt-4 flex flex-wrap gap-x-6 gap-y-5 border border-border bg-surface-raised p-4"
          >
            <input type="hidden" name="intent" value="addSession" />

            <div className="grid min-w-56 flex-1 content-start gap-2">
              <label htmlFor={`${id}-date`} className={labelClasses}>
                Date
              </label>
              <DateField id={`${id}-date`} name="date" />
            </div>

            <TimeField name="time" legend="Start time" legendClassName={labelClasses} />

            <div className="grid min-w-40 flex-1 content-start gap-2">
              <label htmlFor={`${id}-duration`} className={labelClasses}>
                Length
              </label>
              <Select name="duration" items={durationItems} defaultValue="120">
                <SelectTrigger id={`${id}-duration`} className={triggerClasses}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="rounded-none border border-border bg-background ring-0"
                >
                  {durationItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3">
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="brand" size="sm" disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save session"}
                </Button>
              </div>
            </div>
          </fetcher.Form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent"
          >
            <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            Add session
          </button>
        ))}
    </section>
  );
}
