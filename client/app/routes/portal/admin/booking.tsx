import type { Route } from "./+types/booking";
import { fetchBooking, handleStatusUpdate } from "~/lib/bookings";
import { graphqlRequest } from "~/lib/graphql";
import { BookingDetail } from "~/components/portal/booking-detail";
import { StatusForm } from "~/components/portal/status-form";

const ARTISTS_QUERY = /* GraphQL */ `
  query AssignableArtists {
    artists {
      slug
      name
    }
  }
`;

export function meta() {
  return [{ title: "Booking request | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const [booking, { artists }] = await Promise.all([
    fetchBooking(params.id, request.signal),
    graphqlRequest<{ artists: { slug: string; name: string }[] }>(
      ARTISTS_QUERY,
      undefined,
      request.signal,
    ),
  ]);

  return { booking, artists };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  return handleStatusUpdate(params.id, request);
}

export default function AdminBooking({ loaderData, actionData }: Route.ComponentProps) {
  if (!loaderData.booking) {
    return <p className="text-muted-foreground">This booking request doesn't exist.</p>;
  }

  return (
    <BookingDetail
      booking={loaderData.booking}
      backTo="/portal/admin/bookings"
      backLabel="All bookings"
      showArtist
      actions={
        <StatusForm
          key={loaderData.booking.id}
          currentStatus={loaderData.booking.status}
          error={actionData?.error}
          updatedTo={actionData?.updatedTo}
          assignableArtists={loaderData.booking.artist ? undefined : loaderData.artists}
        />
      }
    />
  );
}
