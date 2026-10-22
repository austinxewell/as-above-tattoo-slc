import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/request-new";
import { handleCreateBooking } from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import { NewBookingForm } from "~/components/portal/bookings/new-booking-form";

export function meta() {
  return [{ title: "New booking | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientAction({ request, context }: Route.ClientActionArgs) {
  const mySlug = context.get(currentUserContext).artist?.slug;
  return handleCreateBooking(request, "/portal/artist/requests", mySlug);
}

export default function ArtistNewBooking({ actionData }: Route.ComponentProps) {
  return (
    <section>
      <Link
        to="/portal/artist/requests"
        className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        My requests
      </Link>

      <h1 className="mt-8 font-display text-3xl uppercase">New booking</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Log a booking that came to you through Instagram, Facebook or anywhere else. It's added to
        your requests.
      </p>

      <NewBookingForm error={actionData?.error} cancelTo="/portal/artist/requests" />
    </section>
  );
}
