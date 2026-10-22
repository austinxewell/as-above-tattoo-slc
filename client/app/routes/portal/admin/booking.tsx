import { useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/booking";
import { fetchBooking, handleBookingAction, fetchAssignableArtists } from "~/lib/bookings";
import { Button } from "~/components/ui/button";
import { BookingDetail } from "~/components/portal/bookings/booking-detail";
import { StatusForm } from "~/components/portal/bookings/status-form";
import { ArchiveForm } from "~/components/portal/bookings/archive-form";
import { DeleteDialog } from "~/components/portal/bookings/delete-dialog";

export function meta() {
  return [{ title: "Booking request | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const [booking, artists] = await Promise.all([
    fetchBooking(params.id, request.signal),
    fetchAssignableArtists(request.signal),
  ]);

  return { booking, artists };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  const result = await handleBookingAction(request, params.id);

  if (result.intent === "delete" && !result.error) {
    throw redirect(`/portal/admin/bookings${new URL(request.url).search}`);
  }

  return result;
}

export default function AdminBooking({ loaderData, actionData }: Route.ComponentProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!loaderData.booking) {
    return <p className="text-muted-foreground">This booking request doesn't exist.</p>;
  }

  return (
    <BookingDetail
      booking={loaderData.booking}
      backTo="/portal/admin/bookings"
      backLabel="All bookings"
      showArtist
      canManageSessions={Boolean(loaderData.booking.artist)}
      sessionsHint={loaderData.booking.artist ? undefined : "Assign an artist to add sessions."}
      actions={
        <>
          <StatusForm
            key={loaderData.booking.id}
            currentStatus={loaderData.booking.status}
            error={actionData?.intent === "status" ? actionData.error : null}
            updatedTo={actionData?.updatedTo}
            assignableArtists={loaderData.booking.artist ? undefined : loaderData.artists}
          />
          <ArchiveForm
            archived={Boolean(loaderData.booking.archivedAt)}
            result={
              actionData?.intent === "archive" || actionData?.intent === "unarchive"
                ? actionData
                : undefined
            }
          >
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </ArchiveForm>
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            count={1}
            error={actionData?.intent === "delete" ? actionData.error : null}
          />
        </>
      }
    />
  );
}
