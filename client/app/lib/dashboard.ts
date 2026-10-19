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
  to: string;
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
  attention: DashboardStat[];
  pipeline: PipelineStage[];
  recentRequests: Booking[];
  bookingRequestsEnabled: boolean;
  artists: ArtistBookingState[];
  shop: DashboardStat[];
};

export type ArtistDashboard = {
  attention: DashboardStat[];
  pipeline: PipelineStage[];
  recentRequests: Booking[];
  isBooking: boolean;
  profileTasks: ProfileTask[];
  shop: DashboardStat[];
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

// MOCK: replace with real checks against the artist's profile and portfolio.
export const mockProfileTasks: ProfileTask[] = [
  { label: "Add a profile photo", done: true, to: "/portal/artist/profile" },
  { label: "Write your bio", done: true, to: "/portal/artist/profile" },
  { label: "Add at least 6 portfolio pieces", done: false, to: "/portal/artist/portfolio" },
];

// MOCK: replace once the server can return the oldest new request.
export function mockOldestNewRequestDays(newCount: number) {
  return newCount > 0 ? 6 : null;
}
