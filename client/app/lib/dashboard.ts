import { Package, Receipt, TriangleAlert, type LucideIcon } from "lucide-react";
import { graphqlRequest } from "~/lib/graphql";
import type { Booking, BookingStatus } from "~/lib/bookings";

export type DashboardStat = {
  label: string;
  value: number | null;
  unit?: string;
  to?: string;
  hint?: string;
  icon?: LucideIcon;
};

export type ArtistBookingState = {
  slug: string;
  name: string;
  isBooking: boolean;
};

export type ProfileTask = {
  label: string;
  done: boolean;
  detail: string | null;
  to: string;
};

export type ProfileStatus = {
  isPublished: boolean;
  tasks: ProfileTask[];
};

export type PipelineStage = {
  status: BookingStatus;
  count: number;
};

export type PublicLink = {
  label: string;
  to: string;
  badge: string;
};

export type AdminDashboard = {
  firstName: string;
  attention: DashboardStat[];
  pipeline: PipelineStage[];
  recentRequests: Booking[];
  shop: DashboardStat[];
  bookingRequestsEnabled: boolean;
  artists: ArtistBookingState[];
  publicLinks: PublicLink[];
};

export type ArtistDashboard = {
  firstName: string;
  attention: DashboardStat[];
  pipeline: PipelineStage[];
  recentRequests: Booking[];
  shop: DashboardStat[];
  bookingRequestsEnabled: boolean;
  myBooks: ArtistBookingState | null;
  profile: ProfileStatus;
  publicLinks: PublicLink[];
};

const SITE_STATUS_QUERY = /* GraphQL */ `
  query DashboardSiteStatus {
    bookingRequestsEnabled
    artists {
      slug
      name
      isBooking
    }
  }
`;

export async function fetchSiteStatus(signal?: AbortSignal) {
  return graphqlRequest<{ bookingRequestsEnabled: boolean; artists: ArtistBookingState[] }>(
    SITE_STATUS_QUERY,
    undefined,
    signal,
  );
}

// MOCK: replace with real data once the shop API exists.
export const mockShopStats: DashboardStat[] = [
  { label: "Orders to fulfil", value: 2, hint: "Oldest placed 2 days ago", icon: Package },
  { label: "Sold this month", value: 14, icon: Receipt },
  { label: "Low stock", value: 3, hint: "Prints and aftercare", icon: TriangleAlert },
];

// MOCK: replace with the artist's own listings once the shop API exists.
export const mockArtistShopStats: DashboardStat[] = [
  { label: "Your orders to fulfil", value: 1, hint: "Placed yesterday", icon: Package },
  { label: "Sold this month", value: 5, icon: Receipt },
  { label: "Low stock", value: 1, hint: "One print is almost gone", icon: TriangleAlert },
];

const PROFILE_STATUS_QUERY = /* GraphQL */ `
  query ProfileStatus($slug: String!) {
    artist(slug: $slug) {
      isPublished
      publishChecklist {
        key
        label
        done
        detail
      }
    }
  }
`;

type ChecklistItem = { key: string; label: string; done: boolean; detail: string | null };

export async function fetchProfileStatus(slug: string, signal?: AbortSignal) {
  const { artist } = await graphqlRequest<{
    artist: { isPublished: boolean; publishChecklist: ChecklistItem[] } | null;
  }>(PROFILE_STATUS_QUERY, { slug }, signal);

  return {
    isPublished: artist?.isPublished ?? false,
    tasks: (artist?.publishChecklist ?? []).map((item): ProfileTask => ({
      label: item.label,
      done: item.done,
      detail: item.detail,
      to: item.key === "pieces" ? "/portal/artist/portfolio" : "/portal/artist/profile",
    })),
  } satisfies ProfileStatus;
}

// MOCK: replace once the server can return the oldest new request.
export function mockOldestNewRequestDays(newCount: number) {
  return newCount > 0 ? 6 : null;
}
