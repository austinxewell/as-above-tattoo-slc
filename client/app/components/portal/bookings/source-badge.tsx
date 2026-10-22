import { sourceLabels, type BookingSource } from "~/lib/bookings";

export function SourceBadge({ source }: { source: BookingSource }) {
  if (source === "website") return null;

  return (
    <span className="border border-dashed border-border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
      Via {sourceLabels[source]}
    </span>
  );
}
