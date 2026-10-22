import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import { artistLabel, sizeLabels, type BookingWithActivity } from "~/lib/bookings";
import { ActivityRail } from "./activity-rail";
import { StatusBadge } from "./status-badge";
import { SourceBadge } from "./source-badge";
import { SessionsPanel } from "./sessions-panel";

type BookingDetailProps = {
  booking: BookingWithActivity;
  backTo: string;
  backLabel: string;
  showArtist?: boolean;
  actions?: ReactNode;
  canManageSessions?: boolean;
  sessionsHint?: string;
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
  canManageSessions = false,
  sessionsHint,
}: BookingDetailProps) {
  const details = [
    {
      label: "Email",
      value: booking.email ? (
        <a href={`mailto:${booking.email}`} className={linkClasses}>
          {booking.email}
        </a>
      ) : (
        "Not given"
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
    ...(booking.instagram
      ? [
          {
            label: "Instagram",
            value: (
              <a
                href={`https://www.instagram.com/${encodeURIComponent(booking.instagram)}/`}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                @{booking.instagram}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ),
          },
        ]
      : []),
    { label: "Placement", value: booking.placement },
    { label: "Size", value: sizeLabels[booking.size] },
    { label: "Budget", value: booking.budget ?? "Not given" },
    { label: "Availability", value: booking.availability ?? "Not given" },
  ];

  const { search } = useLocation();

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <article className="min-w-0">
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
            <SourceBadge source={booking.source} />
          </div>
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            {(showArtist || !booking.artist) && <>{artistLabel(booking)} · </>}
            {booking.source === "website" ? "Received" : "Added"}{" "}
            <time dateTime={booking.createdAt}>
              {dateFormat.format(new Date(booking.createdAt))}
            </time>
            {booking.archivedAt && (
              <>
                {" "}
                · Archived{" "}
                <time dateTime={booking.archivedAt}>
                  {dateFormat.format(new Date(booking.archivedAt))}
                </time>
              </>
            )}
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

        <SessionsPanel booking={booking} canManage={canManageSessions} hint={sessionsHint} />

        <section className="mt-8 max-w-2xl">
          <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">Their idea</h2>
          <p className="mt-3 whitespace-pre-line leading-7">{booking.idea}</p>
        </section>
      </article>

      <ActivityRail booking={booking} />
    </div>
  );
}
