import { useState } from "react";
import { Link, useFetcher } from "react-router";
import { Check } from "lucide-react";
import { sizeLabels, type Booking, type BookingActionResult } from "~/lib/bookings";
import { Button } from "~/components/ui/button";
import { StatusBadge } from "~/components/portal/bookings/status-badge";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

type HandoffListProps = {
  requests: Booking[];
  total: number;
  reassignTo: { slug: string; name: string }[];
};

export function HandoffList({ requests, total, reassignTo }: HandoffListProps) {
  const fetcher = useFetcher<BookingActionResult>();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [handledData, setHandledData] = useState(fetcher.data);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const isBusy = fetcher.state !== "idle";
  const error = fetcher.data?.error ?? null;

  if (fetcher.data !== handledData) {
    setHandledData(fetcher.data);

    if (fetcher.data && !fetcher.data.error) {
      const { intent, count } = fetcher.data;
      setSelected(new Set());
      setLastMessage(
        `${count} ${count === 1 ? "request" : "requests"} ${intent === "archive" ? "archived" : "reassigned"}.`,
      );
    }
  }

  const allSelected = requests.length > 0 && selected.size === requests.length;

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(requests.map((booking) => booking.id)));
  }

  if (requests.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-success">
        <Check className="size-4" strokeWidth={2} aria-hidden="true" />
        No open requests left.
      </p>
    );
  }

  return (
    <fetcher.Form method="post">
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="ids" value={id} />
      ))}

      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
        <label className="mr-auto flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="size-4 accent-accent"
          />
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selected` : "Select all"}
          </span>
        </label>

        <label htmlFor="handoff-artist" className="sr-only">
          Reassign to
        </label>
        <select
          id="handoff-artist"
          name="artist"
          defaultValue=""
          className="h-8 border border-border bg-background px-2 text-sm"
        >
          <option value="">Reassign to…</option>
          {reassignTo.map((artist) => (
            <option key={artist.slug} value={artist.slug}>
              {artist.name}
            </option>
          ))}
          <option value="none">No preference</option>
        </select>

        <Button
          type="submit"
          name="intent"
          value="assign"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={isBusy || selected.size === 0}
        >
          Reassign
        </Button>
        <Button
          type="submit"
          name="intent"
          value="archive"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={isBusy || selected.size === 0}
        >
          Archive
        </Button>
      </div>

      <p role="status" className="mt-2 min-h-5 text-sm">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          lastMessage && (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {lastMessage}
            </span>
          )
        )}
      </p>

      <ul className="divide-y divide-border border-b border-border">
        {requests.map((booking) => (
          <li key={booking.id} className="flex items-start gap-3 py-4">
            <input
              type="checkbox"
              checked={selected.has(booking.id)}
              onChange={() => toggle(booking.id)}
              aria-label={`Select request from ${booking.name}`}
              className="mt-1 size-4 shrink-0 accent-accent"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/portal/admin/bookings/${booking.id}`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {booking.name}
                </Link>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                {booking.placement} · {sizeLabels[booking.size]} ·{" "}
                <time dateTime={booking.createdAt}>
                  {dateFormat.format(new Date(booking.createdAt))}
                </time>
              </p>
            </div>
          </li>
        ))}
      </ul>

      {total > requests.length && (
        <p className="mt-3 text-sm text-muted-foreground">
          Showing the first {requests.length} of {total}. The rest appear as you hand these off.
        </p>
      )}
    </fetcher.Form>
  );
}
