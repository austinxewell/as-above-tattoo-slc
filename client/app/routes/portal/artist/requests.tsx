import type { Route } from "./+types/requests";
import {
  statusOptions,
  fetchBookings,
  filterByStatus,
  handleBookingAction,
  filterByAssignment,
  assignmentOptions,
} from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import { BookingList } from "~/components/portal/booking-list";
import { FilterTabs } from "~/components/portal/filter-tabs";
import { ViewSwitch } from "~/components/portal/view-switch";

export function meta() {
  return [{ title: "My requests | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const assignment = url.searchParams.get("for");
  const isArchived = url.searchParams.get("view") === "archived";
  const mySlug = context.get(currentUserContext).artist?.slug;

  const [active, archived] = await Promise.all([
    fetchBookings({ mine: true, signal: request.signal }),
    fetchBookings({ mine: true, archived: true, signal: request.signal }),
  ]);

  const bookings = isArchived ? archived : active;
  const forAssignment = filterByAssignment(bookings, assignment, mySlug);
  const forStatus = filterByStatus(bookings, status);

  return {
    bookings: filterByStatus(forAssignment, status),
    statusOptions: statusOptions(forAssignment),
    assignmentOptions: assignmentOptions(
      forStatus,
      [
        { value: "mine", label: "Mine" },
        { value: "none", label: "No preference" },
      ],
      mySlug,
    ),
    filterKey: url.search,
    mySlug,
    isArchived,
    viewCounts: { active: active.length, archived: archived.length },
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleBookingAction(request);
}

export default function ArtistRequests({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">My requests</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {loaderData.isArchived
              ? 'Archived requests for you, plus archived "No preference" requests.'
              : 'Requests for you, plus "No preference" requests any artist can pick up.'}
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
        key={loaderData.filterKey}
        bookings={loaderData.bookings}
        basePath="/portal/artist/requests"
        assignToSelf={loaderData.mySlug}
        isArchived={loaderData.isArchived}
        result={actionData}
      />
    </section>
  );
}
