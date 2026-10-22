import type { Route } from "./+types/request";
import { fetchBooking, handleBookingAction } from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import { fetchShopDetails, fullAddress } from "~/lib/shop";
import { BookingDetail } from "~/components/portal/bookings/booking-detail";
import { StatusForm } from "~/components/portal/bookings/status-form";
import { ArchiveForm } from "~/components/portal/bookings/archive-form";

export function meta() {
  return [{ title: "My request | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ params, request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const [booking, shop] = await Promise.all([
    fetchBooking(params.id, request.signal),
    fetchShopDetails(request.signal).catch(() => null),
  ]);

  return { booking, mySlug: me.artist?.slug, shopLocation: shop ? fullAddress(shop) : undefined };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  return handleBookingAction(request, params.id);
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
      shopLocation={loaderData.shopLocation}
      canManageSessions={
        Boolean(loaderData.mySlug) && loaderData.booking.artist?.slug === loaderData.mySlug
      }
      sessionsHint={loaderData.booking.artist ? undefined : "Claim this request to add sessions."}
      actions={
        <>
          <StatusForm
            key={loaderData.booking.id}
            currentStatus={loaderData.booking.status}
            error={actionData?.intent === "status" ? actionData.error : null}
            updatedTo={actionData?.updatedTo}
            assignToSelf={loaderData.mySlug}
          />
          {loaderData.mySlug && loaderData.booking.artist?.slug === loaderData.mySlug && (
            <ArchiveForm
              archived={Boolean(loaderData.booking.archivedAt)}
              result={
                actionData?.intent === "archive" || actionData?.intent === "unarchive"
                  ? actionData
                  : undefined
              }
            />
          )}
        </>
      }
    />
  );
}
