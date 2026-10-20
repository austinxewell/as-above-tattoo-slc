import { cn } from "~/lib/utils";
import { statusLabels, type BookingStatus } from "~/lib/bookings";

const statusClasses: Record<BookingStatus, string> = {
  new: "border-accent bg-accent/15 text-accent",
  contacted: "border-border text-foreground",
  scheduled: "border-success bg-success/15 text-success",
  declined: "border-destructive bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em]",
        statusClasses[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
