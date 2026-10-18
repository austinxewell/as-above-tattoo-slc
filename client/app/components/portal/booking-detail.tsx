import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import { sizeLabels, type Booking } from "~/lib/bookings";
import { StatusBadge } from "./status-badge";

type BookingDetailProps = {
  booking: Booking;
  backTo: string;
  backLabel: string;
  showArtist?: boolean;
  actions?: ReactNode;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const linkClasses = "border-b border-accent transition-colors hover:text-accent-hover";

export function BookingDetail({
  booking,
  backTo,
  backLabel,
  showArtist = false,
  actions,
}: BookingDetailProps) {
  const details = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${booking.email}`} className={linkClasses}>
          {booking.email}
        </a>
      ),
    },
    {
      label: "Phone",
      value: booking.phone ? (
        <a href={`tel:${booking.phone}`} className={linkClasses}>
          {booking.phone}
        </a>
      ) : (
        "Not given"
      ),
    },
    { label: "Placement", value: booking.placement },
    { label: "Size", value: sizeLabels[booking.size] },
    { label: "Budget", value: booking.budget ?? "Not given" },
    { label: "Availability", value: booking.availability ?? "Not given" },
  ];

  const { search } = useLocation();

  return (
    <article>
      <Link
        to={`${backTo}${search}`}
        className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {backLabel}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl uppercase">{booking.name}</h1>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
          {(showArtist || !booking.artist) && (
            <>{booking.artist ? `For ${booking.artist.name}` : "No artist preference"} · </>
          )}
          Received{" "}
          <time dateTime={booking.createdAt}>{dateFormat.format(new Date(booking.createdAt))}</time>
        </p>
      </header>

      {actions}

      <dl className="mt-10 grid gap-x-10 gap-y-6 border-y border-border py-8 sm:grid-cols-2">
        {details.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">{label}</dt>
            <dd className="mt-2 break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8 max-w-2xl">
        <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">Their idea</h2>
        <p className="mt-3 whitespace-pre-line leading-7">{booking.idea}</p>
      </section>
    </article>
  );
}
