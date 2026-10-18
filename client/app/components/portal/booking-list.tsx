import { useState } from "react";
import { Form, Link, useLocation, useNavigation } from "react-router";
import { sizeLabels, statusLabels, type Booking, type BookingActionResult } from "~/lib/bookings";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { StatusBadge } from "./status-badge";
import { StatusForm } from "./status-form";

type BookingListProps = {
  bookings: Booking[];
  showArtist?: boolean;
  basePath: string;
  assignableArtists?: { slug: string; name: string }[];
  assignToSelf?: string;
  isArchived?: boolean;
  result?: BookingActionResult;
};

function describeResult({ intent, count, updatedTo }: BookingActionResult, requested: number) {
  const noun = count === 1 ? "request" : "requests";

  if (intent === "status" && updatedTo) {
    return `${count} ${noun} updated to ${statusLabels[updatedTo]}.`;
  }

  const verb = intent === "archive" ? "archived" : "unarchived";

  if (count < requested) {
    return `${count} of ${requested} ${verb}. You can only ${intent} requests assigned to you.`;
  }

  return `${count} ${noun} ${verb}.`;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function BookingList({
  bookings,
  showArtist = false,
  basePath,
  assignableArtists,
  assignToSelf,
  isArchived = false,
  result,
}: BookingListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [handledResult, setHandledResult] = useState(result);

  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (result !== handledResult) {
    setHandledResult(result);

    if (result && !result.error) {
      setSelected(new Set());
      setIsStatusOpen(false);
      setLastMessage(describeResult(result, selected.size));
    }
  }

  const allSelected = bookings.length > 0 && selected.size === bookings.length;

  const anyUnassigned = bookings.some((booking) => selected.has(booking.id) && !booking.artist);

  const anyAssigned = bookings.some((booking) => selected.has(booking.id) && booking.artist);

  const { search } = useLocation();

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(bookings.map((booking) => booking.id)));
  }

  if (bookings.length === 0) {
    return (
      <p className="mt-10 border border-border px-6 py-12 text-center text-muted-foreground">
        No booking requests to show.
      </p>
    );
  }

  return (
    <>
      <div className="mt-10 flex min-h-10 flex-wrap items-center justify-between gap-4 px-2">
        <label className="flex w-fit cursor-pointer items-center gap-4">
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

        {selected.size === 0 && lastMessage && (
          <p role="status" className="flex items-center gap-2 text-sm text-success">
            <Check className="size-4" strokeWidth={2} aria-hidden="true" />
            {lastMessage}
          </p>
        )}

        {result?.intent !== "status" && result?.error && (
          <p role="alert" className="text-sm text-destructive">
            {result.error}
          </p>
        )}

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsStatusOpen(true)}>
              Update Status
            </Button>

            <Form method="post">
              {[...selected].map((id) => (
                <input key={id} type="hidden" name="ids" value={id} />
              ))}
              <Button
                type="submit"
                name="intent"
                value={isArchived ? "unarchive" : "archive"}
                variant="outline"
                size="sm"
                disabled={isSubmitting}
              >
                {isArchived ? "Unarchive" : "Archive"}
              </Button>
            </Form>
          </div>
        )}
      </div>

      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="rounded-none border border-border bg-background">
          <DialogTitle className="font-display text-2xl uppercase">
            Update {selected.size} {selected.size === 1 ? "request" : "requests"}
          </DialogTitle>
          <StatusForm
            ids={[...selected]}
            submitLabel={`Apply to ${selected.size}`}
            assignableArtists={anyUnassigned ? assignableArtists : undefined}
            assignToSelf={assignToSelf}
            error={result?.intent === "status" ? result.error : null}
            showAssignmentNote={anyUnassigned && anyAssigned}
          />
        </DialogContent>
      </Dialog>

      <ul className="mt-4 divide-y divide-border border-y border-border">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex items-start">
            <label className="flex shrink-0 cursor-pointer px-2 py-5">
              <input
                type="checkbox"
                checked={selected.has(booking.id)}
                onChange={() => toggle(booking.id)}
                aria-label={`Select request from ${booking.name}`}
                className="mt-1 size-4 accent-accent"
              />
            </label>
            <Link
              to={`${basePath}/${booking.id}${search}`}
              className="grid min-w-0 flex-1 gap-3 py-5 px-2 transition-colors hover:bg-surface-raised md:grid-cols-[1fr_auto] md:gap-8"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium">{booking.name}</p>

                  <StatusBadge status={booking.status} />

                  {(showArtist || !booking.artist) && (
                    <span className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                      {booking.artist ? `For ${booking.artist.name}` : "No artist preference"}
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {booking.idea}
                </p>

                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                  {booking.placement} · {sizeLabels[booking.size]}
                </p>
              </div>

              <time
                dateTime={booking.createdAt}
                className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground md:text-right"
              >
                {dateFormat.format(new Date(booking.createdAt))}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
