import { replace } from "react-router";
import type { Route } from "./+types/requests";
import {
  assignmentTabs,
  fetchBookingList,
  handleBookingAction,
  readBookingParams,
  statusTabs,
} from "~/lib/bookings";
import { outOfRangePageUrl } from "~/lib/pagination";
import { currentUserContext } from "~/lib/current-user";
import { BookingList } from "~/components/portal/booking-list";
import { FilterTabs } from "~/components/portal/filter-tabs";
import { ViewSwitch } from "~/components/portal/view-switch";
import { Pagination } from "~/components/shared/pagination";
import { SearchField } from "~/components/shared/search-field";

export function meta() {
  return [{ title: "My requests | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const { filter, page } = readBookingParams(url);
  const mySlug = context.get(currentUserContext).artist?.slug;

  const list = await fetchBookingList({ ...filter, mine: true }, page, request.signal);

  const lastPageUrl = outOfRangePageUrl(url, list.page);
  if (lastPageUrl) throw replace(lastPageUrl);

  return {
    bookings: list.page.items,
    pagination: { total: list.page.total, page: list.page.page, pageSize: list.page.pageSize },
    statusOptions: statusTabs(list.counts),
    assignmentOptions: assignmentTabs(
      list.counts,
      [
        { value: "mine", label: "Mine" },
        { value: "none", label: "No preference" },
      ],
      mySlug,
    ),
    filterKey: url.search,
    mySlug,
    isArchived: filter.archived,
    viewCounts: { active: list.counts.active, archived: list.counts.archived },
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
        key={loaderData.filterKey}
        bookings={loaderData.bookings}
        basePath="/portal/artist/requests"
        assignToSelf={loaderData.mySlug}
        isArchived={loaderData.isArchived}
        result={actionData}
      />

      <Pagination
        {...loaderData.pagination}
        label="Request pages"
        className="sticky bottom-0 z-10 -mt-px border-t border-border bg-background pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      />
    </section>
  );
}
