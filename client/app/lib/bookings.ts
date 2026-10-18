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
  archivedAt: string | null;
  createdAt: string;
};

const BOOKINGS_QUERY = /* GraphQL */ `
  query Bookings($mine: Boolean, $archived: Boolean) {
    bookings(mine: $mine, archived: $archived) {
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
      archivedAt
      createdAt
    }
  }
`;

export async function fetchBookings({
  mine = false,
  archived = false,
  signal,
}: { mine?: boolean; archived?: boolean; signal?: AbortSignal } = {}) {
  const { bookings } = await graphqlRequest<{ bookings: Booking[] }>(
    BOOKINGS_QUERY,
    { mine, archived },
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
      archivedAt
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

const ARCHIVE_BOOKINGS_MUTATION = /* GraphQL */ `
  mutation ArchiveBookings($ids: [ID!]!) {
    count: archiveBookings(ids: $ids)
  }
`;

const UNARCHIVE_BOOKINGS_MUTATION = /* GraphQL */ `
  mutation UnarchiveBookings($ids: [ID!]!) {
    count: unarchiveBookings(ids: $ids)
  }
`;

export async function setBookingsArchived(ids: string[], archived: boolean, signal?: AbortSignal) {
  const { count } = await graphqlRequest<{ count: number }>(
    archived ? ARCHIVE_BOOKINGS_MUTATION : UNARCHIVE_BOOKINGS_MUTATION,
    { ids },
    signal,
  );
  return count;
}

const DELETE_BOOKINGS_MUTATION = /* GraphQL */ `
  mutation DeleteBookings($ids: [ID!]!) {
    count: deleteBookings(ids: $ids)
  }
`;

export async function deleteBookings(ids: string[], signal?: AbortSignal) {
  const { count } = await graphqlRequest<{ count: number }>(
    DELETE_BOOKINGS_MUTATION,
    { ids },
    signal,
  );
  return count;
}

export type BookingActionResult = {
  intent: "status" | "archive" | "unarchive" | "delete";
  error: string | null;
  count: number;
  updatedTo: BookingStatus | null;
};

export async function handleBookingAction(
  request: Request,
  id?: string,
): Promise<BookingActionResult> {
  const formData = await request.formData();
  const ids = id ? [id] : formData.getAll("ids").map(String);
  const rawIntent = formData.get("intent");
  const intent =
    rawIntent === "archive" || rawIntent === "unarchive" || rawIntent === "delete"
      ? rawIntent
      : "status";

  try {
    if (intent === "delete") {
      const count = await deleteBookings(ids, request.signal);
      return { intent, error: null, count, updatedTo: null };
    }

    if (intent === "archive" || intent === "unarchive") {
      const count = await setBookingsArchived(ids, intent === "archive", request.signal);
      return { intent, error: null, count, updatedTo: null };
    }

    const status = String(formData.get("status") ?? "");
    const assignTo = String(formData.get("assignTo") ?? "") || null;

    if (!isBookingStatus(status)) {
      return { intent, error: "Choose a status.", count: 0, updatedTo: null };
    }

    const count = await updateBookingStatus({ ids, status, assignTo }, request.signal);
    return { intent, error: null, count, updatedTo: status };
  } catch (error) {
    return {
      intent,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      count: 0,
      updatedTo: null,
    };
  }
}

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
