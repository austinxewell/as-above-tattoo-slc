import type { Route } from "./+types/requests";
import { countByStatus, fetchBookings, filterByStatus } from "~/lib/bookings";
import { BookingList } from "~/components/portal/booking-list";
import { StatusFilter } from "~/components/portal/status-filter";

export function meta() {
  return [{ title: "My requests | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const status = new URL(request.url).searchParams.get("status");
  const bookings = await fetchBookings({ mine: true, signal: request.signal });

  return { bookings: filterByStatus(bookings, status), counts: countByStatus(bookings) };
}

export default function ArtistRequests({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <h1 className="font-display text-3xl uppercase">My requests</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Requests for you, plus "No preference" requests any artist can pick up.
      </p>

      <StatusFilter counts={loaderData.counts} />

      <BookingList bookings={loaderData.bookings} basePath="/portal/artist/requests" />
    </section>
  );
}
