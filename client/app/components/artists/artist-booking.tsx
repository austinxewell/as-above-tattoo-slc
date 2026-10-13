import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ArtistBookingProps = {
  name: string;
  slug: string;
  isBooking: boolean;
  booking: {
    minimum: string;
    rate: string;
    deposit: string;
    availability: string;
    notes: string[];
  };
};

export function ArtistBooking({ name, slug, isBooking, booking }: ArtistBookingProps) {
  const firstName = name.split(" ")[0];
  const details = [
    { label: "Minimum", value: booking.minimum },
    { label: "Rate", value: booking.rate },
    { label: "Deposit", value: booking.deposit },
  ];

  return (
    <section
      className="border-t border-accent/30 px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="booking-title"
    >
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2
            id="booking-title"
            className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
          >
            Booking with {firstName}
          </h2>

          <p className="mt-6 flex items-center gap-3 text-[0.65rem] leading-none uppercase tracking-[0.2em]">
            <span
              className={`size-2 -translate-y-px rounded-full ${isBooking ? "bg-accent" : "bg-muted-foreground/40"}`}
              aria-hidden="true"
            />
            {booking.availability}
          </p>

          {isBooking && (
            <Link
              to={`/booking?artist=${slug}#request`}
              className={cn(buttonVariants({ variant: "brand", size: "cta" }), "mt-10")}
            >
              Book with {firstName}
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          )}
        </div>

        <div>
          <dl>
            {details.map((detail) => (
              <div
                key={detail.label}
                className="grid gap-1 border-t border-border py-5 last:border-b sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                  {detail.label}
                </dt>
                <dd className="leading-7">{detail.value}</dd>
              </div>
            ))}
          </dl>

          {booking.notes.length > 0 && (
            <>
              <h3 className="mt-10 text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                Good to know
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {booking.notes.map((note) => (
                  <li key={note} className="flex gap-3 leading-7 text-muted-foreground">
                    <span className="text-accent" aria-hidden="true">
                      &mdash;
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
