import type { Route } from "./+types/bookings";
import { countByStatus, fetchBookings, filterByStatus } from "~/lib/bookings";
import { BookingList } from "~/components/portal/booking-list";
import { StatusFilter } from "~/components/portal/status-filter";

export function meta() {
  return [{ title: "Bookings | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const status = new URL(request.url).searchParams.get("status");
  const bookings = await fetchBookings({ signal: request.signal });

  return { bookings: filterByStatus(bookings, status), counts: countByStatus(bookings) };
}

export default function AdminBookings({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <h1 className="font-display text-3xl uppercase">Bookings</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Every booking request, newest first.</p>

      <StatusFilter counts={loaderData.counts} />

      <BookingList bookings={loaderData.bookings} showArtist basePath="/portal/admin/bookings" />
    </section>
  );
}
