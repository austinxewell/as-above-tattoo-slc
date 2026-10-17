import { sizeLabels, type Booking } from "~/lib/bookings";
import { StatusBadge } from "./status-badge";
import { Link } from "react-router";

type BookingListProps = {
  bookings: Booking[];
  showArtist?: boolean;
  basePath: string;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function BookingList({ bookings, showArtist = false, basePath }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <p className="mt-10 border border-border px-6 py-12 text-center text-muted-foreground">
        No booking requests to show.
      </p>
    );
  }

  return (
    <ul className="mt-10 divide-y divide-border border-y border-border">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <Link
            to={`${basePath}/${booking.id}`}
            className="grid gap-3 px-2 py-5 transition-colors hover:bg-surface-raised md:grid-cols-[1fr_auto] md:gap-8"
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
  );
}
