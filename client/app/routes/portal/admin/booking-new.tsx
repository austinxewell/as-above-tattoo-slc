import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/booking-new";
import { fetchAssignableArtists, handleCreateBooking } from "~/lib/bookings";
import { NewBookingForm } from "~/components/portal/bookings/new-booking-form";

export function meta() {
  return [{ title: "New booking | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { artists: await fetchAssignableArtists(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleCreateBooking(request, "/portal/admin/bookings");
}

export default function AdminNewBooking({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <section>
      <Link
        to="/portal/admin/bookings"
        className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Bookings
      </Link>

      <h1 className="mt-8 font-display text-3xl uppercase">New booking</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Log a booking that came in through Instagram, Facebook or anywhere else.
      </p>

      <NewBookingForm
        artists={loaderData.artists}
        error={actionData?.error}
        cancelTo="/portal/admin/bookings"
      />
    </section>
  );
}
