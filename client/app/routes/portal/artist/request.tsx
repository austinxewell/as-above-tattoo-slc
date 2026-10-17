import type { Route } from "./+types/request";
import { fetchBooking, handleStatusUpdate } from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import { BookingDetail } from "~/components/portal/booking-detail";
import { StatusForm } from "~/components/portal/status-form";

export function meta() {
  return [{ title: "My request | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ params, request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const booking = await fetchBooking(params.id, request.signal);

  return { booking, mySlug: me.artist?.slug };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  return handleStatusUpdate(params.id, request);
}

export default function ArtistRequest({ loaderData, actionData }: Route.ComponentProps) {
  if (!loaderData.booking) {
    return <p className="text-muted-foreground">This booking request doesn't exist.</p>;
  }

  return (
    <BookingDetail
      booking={loaderData.booking}
      backTo="/portal/artist/requests"
      backLabel="My requests"
      actions={
        <StatusForm
          key={loaderData.booking.id}
          currentStatus={loaderData.booking.status}
          error={actionData?.error}
          updatedTo={actionData?.updatedTo}
          assignToSelf={loaderData.mySlug}
        />
      }
    />
  );
}
