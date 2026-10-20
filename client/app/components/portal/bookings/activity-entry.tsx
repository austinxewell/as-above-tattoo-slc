import type { BookingActivity } from "~/lib/bookings";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function ActivityEntry({ entry }: { entry: BookingActivity }) {
  const time = (
    <time dateTime={entry.createdAt} className="tabular-nums">
      {timeFormat.format(new Date(entry.createdAt))}
    </time>
  );

  if (entry.type === "note") {
    return (
      <li className="border border-border bg-background px-3.5 py-3">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
          <span className="font-semibold text-accent">{entry.authorName}</span> · {time}
        </p>
        <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6">{entry.text}</p>
      </li>
    );
  }

  return (
    <li className="text-center text-xs leading-5 text-muted-foreground">
      <span className="font-medium text-foreground">{entry.text}</span> · {entry.authorName} ·{" "}
      {time}
    </li>
  );
}
