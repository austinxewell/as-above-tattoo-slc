import type { Route } from "./+types/index";
import { bookingStatuses, fetchBookingList } from "~/lib/bookings";
import { currentUserContext } from "~/lib/current-user";
import {
  fetchSiteStatus,
  mockArtistShopStats,
  mockOldestNewRequestDays,
  mockProfileTasks,
  type ArtistDashboard as ArtistDashboardData,
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
import { ProfileChecklist } from "~/components/portal/dashboard/profile-checklist";
import { PublicLinks } from "~/components/portal/dashboard/public-links";

const requestsPath = "/portal/artist/requests";

export function meta() {
  return [{ title: "Dashboard | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const me = context.get(currentUserContext);
  const mySlug = me.artist?.slug;

  const [newRequests, active, site] = await Promise.all([
    fetchBookingList({ mine: true, status: "new" }, 1, request.signal),
    fetchBookingList({ mine: true }, 1, request.signal),
    fetchSiteStatus(request.signal),
  ]);

  const countFor = (slug: string | null | undefined) =>
    newRequests.counts.byArtist.find((group) => group.slug === slug)?.count ?? 0;
  const mineCount = mySlug ? countFor(mySlug) : 0;
  const unclaimedCount = countFor(null);
  const oldestDays = mockOldestNewRequestDays(newRequests.page.total);

  return {
    firstName: me.name.split(" ")[0],
    attention: [
      {
        label: "Your new requests",
        value: mineCount,
        unit: "inbox",
        hint: mineCount > 0 ? "Clients waiting on you" : "You've replied to everyone",
        to: mineCount > 0 ? `${requestsPath}?status=new&for=mine` : undefined,
      },
      {
        label: "No preference",
        value: unclaimedCount,
        unit: "unclaimed",
        hint: unclaimedCount > 0 ? "Any artist can pick these up" : "Nothing to pick up",
        to: unclaimedCount > 0 ? `${requestsPath}?status=new&for=none` : undefined,
      },
      {
        label: "Oldest unanswered",
        value: oldestDays,
        unit: "days",
        hint: oldestDays === null ? "No one is waiting" : "The longest a client has waited",
        to: oldestDays === null ? undefined : `${requestsPath}?status=new`,
      },
    ] satisfies DashboardStat[],
    pipeline: bookingStatuses.map((status) => ({
      status,
      count: active.counts.byStatus.find((group) => group.status === status)?.count ?? 0,
    })),
    recentRequests: active.page.items.slice(0, 5),
    shop: mockArtistShopStats,
    bookingRequestsEnabled: site.bookingRequestsEnabled,
    myBooks: site.artists.find((artist) => artist.slug === mySlug) ?? null,
    profileTasks: mockProfileTasks,
    publicLinks: [
      ...(mySlug
        ? [
            {
              label: "Your artist page",
              to: `/artists/${mySlug}`,
              badge: "/images/logos/artist-badge.svg",
            },
          ]
        : []),
      { label: "Booking page", to: "/booking", badge: "/images/logos/booking-badge.svg" },
      { label: "Aftercare page", to: "/after-care", badge: "/images/logos/after-care-badge.svg" },
    ] satisfies PublicLink[],
  } satisfies ArtistDashboardData;
}

export default function ArtistDashboard({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <DashboardGreeting name={loaderData.firstName} />

      <TarotSpread stats={loaderData.attention} label="Needs attention" className="mt-8" />

      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid min-w-0 content-start gap-12">
          <DashboardSection title="Pipeline" action={{ label: "All requests", to: requestsPath }}>
            <PipelineBar stages={loaderData.pipeline} basePath={requestsPath} />
          </DashboardSection>

          <DashboardSection
            title="Recent requests"
            action={{ label: "View all", to: requestsPath }}
          >
            <RecentRequests bookings={loaderData.recentRequests} basePath={requestsPath} />
          </DashboardSection>

          <DashboardSection title="Your shop">
            <StatGrid stats={loaderData.shop} />
          </DashboardSection>
        </div>

        <aside className="grid content-start gap-10 sm:grid-cols-2 xl:grid-cols-1">
          {loaderData.myBooks && (
            <DashboardSection
              title="Your books"
              action={{ label: "Edit profile", to: "/portal/artist/profile" }}
            >
              <ArtistBooks artists={[loaderData.myBooks]} />
            </DashboardSection>
          )}

          <DashboardSection title="Your profile">
            <ProfileChecklist tasks={loaderData.profileTasks} />
          </DashboardSection>

          <DashboardSection title="Website">
            <SiteStatus bookingRequestsEnabled={loaderData.bookingRequestsEnabled} />
          </DashboardSection>

          <DashboardSection title="Public pages">
            <PublicLinks links={loaderData.publicLinks} />
          </DashboardSection>
        </aside>
      </div>
    </section>
  );
}
