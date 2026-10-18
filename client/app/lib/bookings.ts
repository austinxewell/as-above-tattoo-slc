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

export function filterByStatus(bookings: Booking[], status: string | null) {
  return isBookingStatus(status)
    ? bookings.filter((booking) => booking.status === status)
    : bookings;
}

export function statusOptions(bookings: Booking[]) {
  return [
    { value: "all", label: "All", count: bookings.length },
    ...bookingStatuses.map((status) => ({
      value: status,
      label: statusLabels[status],
      count: bookings.filter((booking) => booking.status === status).length,
    })),
  ];
}

export function filterByAssignment(bookings: Booking[], value: string | null, mySlug?: string) {
  if (!value || value === "all") return bookings;
  if (value === "none") return bookings.filter((booking) => !booking.artist);
  if (value === "mine") return bookings.filter((booking) => booking.artist?.slug === mySlug);
  return bookings.filter((booking) => booking.artist?.slug === value);
}

export function assignmentOptions(
  bookings: Booking[],
  choices: { value: string; label: string }[],
  mySlug?: string,
) {
  return [
    { value: "all", label: "Everyone", count: bookings.length },
    ...choices.map((choice) => ({
      ...choice,
      count: filterByAssignment(bookings, choice.value, mySlug).length,
    })),
  ];
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

export async function handleStatusUpdate(request: Request, id?: string) {
  const formData = await request.formData();
  const ids = id ? [id] : formData.getAll("ids").map(String);
  const status = String(formData.get("status") ?? "");
  const assignTo = String(formData.get("assignTo") ?? "") || null;

  if (!isBookingStatus(status)) {
    return { error: "Choose a status.", updatedTo: null, count: 0 };
  }

  try {
    const count = await updateBookingStatus({ ids, status, assignTo }, request.signal);
    return { error: null, updatedTo: status, count };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      updatedTo: null,
      count: 0,
    };
  }
}

export type StatusUpdateResult = Awaited<ReturnType<typeof handleStatusUpdate>>;

const ASSIGNABLE_ARTISTS_QUERY = /* GraphQL */ `
  query AssignableArtists {
    artists {
      slug
      name
    }
  }
`;

export async function fetchAssignableArtists(signal?: AbortSignal) {
  const { artists } = await graphqlRequest<{ artists: { slug: string; name: string }[] }>(
    ASSIGNABLE_ARTISTS_QUERY,
    undefined,
    signal,
  );
  return artists;
}
