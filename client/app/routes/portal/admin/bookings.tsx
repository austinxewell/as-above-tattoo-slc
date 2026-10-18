import type { Route } from "./+types/bookings";
import {
  statusOptions,
  fetchAssignableArtists,
  fetchBookings,
  filterByStatus,
  handleBookingAction,
  filterByAssignment,
  assignmentOptions,
} from "~/lib/bookings";
import { BookingList } from "~/components/portal/booking-list";
import { FilterTabs } from "~/components/portal/filter-tabs";
import { ViewSwitch } from "~/components/portal/view-switch";

export function meta() {
  return [{ title: "Bookings | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const assignment = url.searchParams.get("for");
  const isArchived = url.searchParams.get("view") === "archived";

  const [active, archived, artists] = await Promise.all([
    fetchBookings({ signal: request.signal }),
    fetchBookings({ archived: true, signal: request.signal }),
    fetchAssignableArtists(request.signal),
  ]);

  const bookings = isArchived ? archived : active;
  const forAssignment = filterByAssignment(bookings, assignment);
  const forStatus = filterByStatus(bookings, status);

  return {
    bookings: filterByStatus(forAssignment, status),
    statusOptions: statusOptions(forAssignment),
    assignmentOptions: assignmentOptions(forStatus, [
      { value: "none", label: "No preference" },
      ...artists.map((artist) => ({ value: artist.slug, label: artist.name })),
    ]),
    filterKey: url.search,
    artists,
    isArchived,
    viewCounts: { active: active.length, archived: archived.length },
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleBookingAction(request);
}

export default function AdminBookings({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">Bookings</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {loaderData.isArchived
              ? "Archived booking requests, newest first."
              : "Every booking request, newest first."}
          </p>
        </div>

        <ViewSwitch counts={loaderData.viewCounts} />
      </div>

      <div className="mt-10">
        <FilterTabs param="for" label="Filter by artist" options={loaderData.assignmentOptions} />
      </div>

      <div className="mt-6">
        <FilterTabs param="status" label="Filter by status" options={loaderData.statusOptions} />
      </div>

      <BookingList
        key={loaderData.filterKey ?? "all"}
        bookings={loaderData.bookings}
        showArtist
        basePath="/portal/admin/bookings"
        assignableArtists={loaderData.artists}
        isArchived={loaderData.isArchived}
        canDelete
        result={actionData}
      />
    </section>
  );
}
