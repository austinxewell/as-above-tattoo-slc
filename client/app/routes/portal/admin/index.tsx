import type { Route } from "./+types/index";
import { bookingStatuses, fetchBookingList } from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import {
  fetchSiteStatus,
  mockOldestNewRequestDays,
  mockShopStats,
  type DashboardStat,
  type PublicLink,
} from "~/lib/dashboard";
import { DashboardGreeting } from "~/components/portal/dashboard/dashboard-greeting";
import { DashboardSection } from "~/components/portal/dashboard/dashboard-section";
import { StatGrid } from "~/components/portal/dashboard/stat-grid";
import { TarotSpread } from "~/components/portal/dashboard/tarot-spread";
import { PipelineBar } from "~/components/portal/dashboard/pipeline-bar";
import { RecentRequests } from "~/components/portal/dashboard/recent-requests";
import { SiteStatus } from "~/components/portal/dashboard/site-status";
import { ArtistBooks } from "~/components/portal/dashboard/artist-books";
import { PublicLinks } from "~/components/portal/dashboard/public-links";

export function meta() {
  return [{ title: "Dashboard | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const [newRequests, active, site] = await Promise.all([
    fetchBookingList({ status: "new" }, 1, request.signal),
    fetchBookingList({}, 1, request.signal),
    fetchSiteStatus(request.signal),
  ]);
  const waitingForArtist =
    newRequests.counts.byArtist.find((group) => group.slug === null)?.count ?? 0;
  const newCount = newRequests.page.total;
  const oldestDays = mockOldestNewRequestDays(newCount);

  return {
    firstName: me.name.split(" ")[0],
    attention: [
      {
        label: "New requests",
        value: newCount,
        unit: "inbox",
        hint: newCount > 0 ? "Waiting for a first reply" : "Every request has a reply",
        to: newCount > 0 ? "/portal/admin/bookings?status=new" : undefined,
      },
      {
        label: "No preference",
        value: waitingForArtist,
        unit: "unclaimed",
        hint:
          waitingForArtist > 0 ? "No artist has picked these up" : "Every request has an artist",
        to: waitingForArtist > 0 ? "/portal/admin/bookings?status=new&for=none" : undefined,
      },
      {
        label: "Oldest unanswered",
        value: oldestDays,
        unit: "days",
        hint: oldestDays === null ? "No one is waiting" : "The longest a client has waited",
        to: oldestDays === null ? undefined : "/portal/admin/bookings?status=new",
      },
    ] satisfies DashboardStat[],
    pipeline: bookingStatuses.map((status) => ({
      status,
      count: active.counts.byStatus.find((group) => group.status === status)?.count ?? 0,
    })),
    recentRequests: active.page.items.slice(0, 5),
    shop: mockShopStats,
    bookingRequestsEnabled: site.bookingRequestsEnabled,
    artists: site.artists,
    publicLinks: [
      { label: "Booking Page", to: "/booking", badge: "/images/logos/booking-badge.svg" },
      { label: "Artists Page", to: "/artists", badge: "/images/logos/artist-badge.svg" },
      { label: "Aftercare Page", to: "/after-care", badge: "/images/logos/after-care-badge.svg" },
    ] satisfies PublicLink[],
  };
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <DashboardGreeting name={loaderData.firstName} />

      <TarotSpread stats={loaderData.attention} label="Needs attention" className="mt-8" />

      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid min-w-0 content-start gap-12">
          <DashboardSection
            title="Pipeline"
            action={{ label: "All bookings", to: "/portal/admin/bookings" }}
          >
            <PipelineBar stages={loaderData.pipeline} basePath="/portal/admin/bookings" />
          </DashboardSection>

          <DashboardSection
            title="Recent requests"
            action={{ label: "View all", to: "/portal/admin/bookings" }}
          >
            <RecentRequests
              bookings={loaderData.recentRequests}
              basePath="/portal/admin/bookings"
              showArtist
            />
          </DashboardSection>

          <DashboardSection title="Shop">
            <StatGrid stats={loaderData.shop} />
          </DashboardSection>
        </div>

        <aside className="grid content-start gap-10 sm:grid-cols-2 xl:grid-cols-1">
          <DashboardSection title="Website">
            <SiteStatus bookingRequestsEnabled={loaderData.bookingRequestsEnabled} />
          </DashboardSection>

          <DashboardSection
            title="Artists"
            action={{ label: "Manage", to: "/portal/admin/artists" }}
          >
            <ArtistBooks artists={loaderData.artists} />
          </DashboardSection>

          <DashboardSection title="Public pages">
            <PublicLinks links={loaderData.publicLinks} />
          </DashboardSection>
        </aside>
      </div>
    </section>
  );
}
