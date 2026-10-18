import type { Route } from "./+types/bookings";
import { replace } from "react-router";
import {
  assignmentTabs,
  fetchAssignableArtists,
  fetchBookingList,
  handleBookingAction,
  readBookingParams,
  statusTabs,
} from "~/lib/bookings";
import { outOfRangePageUrl } from "~/lib/pagination";
import { BookingList } from "~/components/portal/booking-list";
import { FilterTabs } from "~/components/portal/filter-tabs";
import { ViewSwitch } from "~/components/portal/view-switch";
import { Pagination } from "~/components/shared/pagination";
import { SearchField } from "~/components/shared/search-field";

export function meta() {
  return [{ title: "Bookings | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const { filter, page } = readBookingParams(url);

  const [list, artists] = await Promise.all([
    fetchBookingList(filter, page, request.signal),
    fetchAssignableArtists(request.signal),
  ]);

  const lastPageUrl = outOfRangePageUrl(url, list.page);
  if (lastPageUrl) throw replace(lastPageUrl);

  return {
    bookings: list.page.items,
    pagination: { total: list.page.total, page: list.page.page, pageSize: list.page.pageSize },
    statusOptions: statusTabs(list.counts),
    assignmentOptions: assignmentTabs(list.counts, [
      { value: "none", label: "No preference" },
      ...artists.map((artist) => ({ value: artist.slug, label: artist.name })),
    ]),
    filterKey: url.search,
    search: filter.search,
    artists,
    isArchived: filter.archived,
    viewCounts: { active: list.counts.active, archived: list.counts.archived },
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

      <SearchField
        label="Search clients"
        placeholder="Client name or email"
        className="mt-8 max-w-md"
      />

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
        emptyMessage={
          loaderData.search
            ? `No requests from clients matching "${loaderData.search}".`
            : undefined
        }
        result={actionData}
      />

      <Pagination
        {...loaderData.pagination}
        label="Booking pages"
        className="sticky bottom-0 z-10 -mt-px border-t border-border bg-background pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      />
    </section>
  );
}
