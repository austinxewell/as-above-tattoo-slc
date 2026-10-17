import { graphqlRequest } from "~/lib/graphql";

export type BookingStatus = "new" | "contacted" | "scheduled" | "declined";
export type BookingSize = "small" | "medium" | "large" | "project";

export type Booking = {
  id: string;
  artist: { slug: string; name: string } | null;
  name: string;
  email: string;
  phone: string | null;
  placement: string;
  size: BookingSize;
  budget: string | null;
  idea: string;
  availability: string | null;
  status: BookingStatus;
  createdAt: string;
};

const BOOKINGS_QUERY = /* GraphQL */ `
  query Bookings($mine: Boolean) {
    bookings(mine: $mine) {
      id
      artist {
        slug
        name
      }
      name
      email
      phone
      placement
      size
      budget
      idea
      availability
      status
      createdAt
    }
  }
`;

export async function fetchBookings({
  mine = false,
  signal,
}: { mine?: boolean; signal?: AbortSignal } = {}) {
  const { bookings } = await graphqlRequest<{ bookings: Booking[] }>(
    BOOKINGS_QUERY,
    { mine },
    signal,
  );
  return bookings;
}

const BOOKING_QUERY = /* GraphQL */ `
  query Booking($id: ID!) {
    booking(id: $id) {
      id
      artist {
        slug
        name
      }
      name
      email
      phone
      placement
      size
      budget
      idea
      availability
      status
      createdAt
    }
  }
`;

export async function fetchBooking(id: string, signal?: AbortSignal) {
  const { booking } = await graphqlRequest<{ booking: Booking | null }>(
    BOOKING_QUERY,
    { id },
    signal,
  );
  return booking;
}

export const statusLabels: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  declined: "Declined",
};

export const sizeLabels: Record<BookingSize, string> = {
  small: "Small (under 2 in)",
  medium: "Medium (2–5 in)",
  large: "Large (5+ in)",
  project: "Large project",
};

export const bookingStatuses: BookingStatus[] = ["new", "contacted", "scheduled", "declined"];

export function isBookingStatus(value: string | null): value is BookingStatus {
  return bookingStatuses.includes(value as BookingStatus);
}

export function countByStatus(bookings: Booking[]) {
  const counts: Record<BookingStatus | "all", number> = {
    all: bookings.length,
    new: 0,
    contacted: 0,
    scheduled: 0,
    declined: 0,
  };

  for (const booking of bookings) {
    counts[booking.status] += 1;
  }

  return counts;
}

export function filterByStatus(bookings: Booking[], status: string | null) {
  return isBookingStatus(status)
    ? bookings.filter((booking) => booking.status === status)
    : bookings;
}

const UPDATE_BOOKING_STATUS_MUTATION = /* GraphQL */ `
  mutation UpdateBookingStatus($ids: [ID!]!, $status: BookingStatus!, $assignTo: String) {
    updateBookingStatus(ids: $ids, status: $status, assignTo: $assignTo)
  }
`;

export async function updateBookingStatus(
  { ids, status, assignTo }: { ids: string[]; status: BookingStatus; assignTo?: string | null },
  signal?: AbortSignal,
) {
  const { updateBookingStatus: count } = await graphqlRequest<{ updateBookingStatus: number }>(
    UPDATE_BOOKING_STATUS_MUTATION,
    { ids, status, assignTo: assignTo ?? null },
    signal,
  );
  return count;
}

export async function handleStatusUpdate(id: string, request: Request) {
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "");
  const assignTo = String(formData.get("assignTo") ?? "") || null;

  if (!isBookingStatus(status)) {
    return { error: "Choose a status.", updatedTo: null };
  }

  try {
    await updateBookingStatus({ ids: [id], status, assignTo }, request.signal);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      updatedTo: null,
    };
  }

  return { error: null, updatedTo: status };
}
