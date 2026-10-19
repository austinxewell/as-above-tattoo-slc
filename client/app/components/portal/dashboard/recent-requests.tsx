import { Link } from "react-router";
import { sizeLabels, type Booking } from "~/lib/bookings";
import { StatusBadge } from "~/components/portal/status-badge";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

type RecentRequestsProps = {
  bookings: Booking[];
  basePath: string;
  showArtist?: boolean;
};

export function RecentRequests({ bookings, basePath, showArtist = false }: RecentRequestsProps) {
  if (bookings.length === 0) {
    return (
      <p className="border-y border-border py-8 text-center text-muted-foreground">
        No booking requests yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <Link
            to={`${basePath}/${booking.id}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-1 py-3 transition-colors hover:bg-surface-raised"
          >
            <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <span className="truncate font-medium">{booking.name}</span>
              <StatusBadge status={booking.status} />
            </span>

            <time
              dateTime={booking.createdAt}
              className="text-[0.62rem] uppercase tracking-[0.15em] text-muted-foreground"
            >
              {dateFormat.format(new Date(booking.createdAt))}
            </time>

            <span className="col-span-2 truncate text-[0.62rem] uppercase tracking-[0.15em] text-muted-foreground">
              {booking.placement} · {sizeLabels[booking.size]}
              {(showArtist || !booking.artist) &&
                ` · ${booking.artist ? `For ${booking.artist.name}` : "No preference"}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
