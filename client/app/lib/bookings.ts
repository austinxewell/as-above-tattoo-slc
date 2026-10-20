import { graphqlRequest } from "~/lib/graphql";

export type BookingStatus = "new" | "contacted" | "scheduled" | "declined";
export type BookingSize = "small" | "medium" | "large" | "project";

export type Booking = {
  id: string;
  artist: { slug: string; name: string } | null;
  formerArtistName: string | null;
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

export type BookingActivity = {
  id: string;
  type: "note" | "event";
  text: string;
  authorName: string;
  createdAt: string;
};

export type BookingWithActivity = Booking & { activity: BookingActivity[] };

const BOOKING_FIELDS = /* GraphQL */ `
  fragment BookingFields on BookingRequest {
    id
    artist {
      slug
      name
    }
    formerArtistName
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
`;

const BOOKING_QUERY = /* GraphQL */ `
  query Booking($id: ID!) {
    booking(id: $id) {
      ...BookingFields
      activity {
        id
        type
        text
        authorName
        createdAt
      }
    }
  }
  ${BOOKING_FIELDS}
`;

export async function fetchBooking(id: string, signal?: AbortSignal) {
  const { booking } = await graphqlRequest<{ booking: BookingWithActivity | null }>(
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

export function artistLabel(
  booking: Pick<Booking, "artist" | "formerArtistName">,
  noneLabel = "No artist preference",
) {
  if (booking.artist) return `For ${booking.artist.name}`;
  if (booking.formerArtistName) return `Formerly ${booking.formerArtistName}`;
  return noneLabel;
}

export const bookingStatuses: BookingStatus[] = ["new", "contacted", "scheduled", "declined"];

export function isBookingStatus(value: string | null): value is BookingStatus {
  return bookingStatuses.includes(value as BookingStatus);
}

export type BookingFilter = {
  mine?: boolean;
  archived?: boolean;
  status?: BookingStatus | null;
  statuses?: BookingStatus[];
  assignment?: string | null;
  search?: string | null;
};

export type BookingCounts = {
  active: number;
  archived: number;
  byStatus: { status: BookingStatus; count: number }[];
  statusTotal: number;
  byArtist: { slug: string | null; count: number }[];
  artistTotal: number;
};

export type BookingPage = {
  items: Booking[];
  total: number;
  page: number;
  pageSize: number;
};

const BOOKING_LIST_QUERY = /* GraphQL */ `
  query BookingList($filter: BookingFilter, $page: Int) {
    page: bookingPage(filter: $filter, page: $page) {
      total
      page
      pageSize
      items {
        ...BookingFields
      }
    }
    counts: bookingCounts(filter: $filter) {
      active
      archived
      statusTotal
      artistTotal
      byStatus {
        status
        count
      }
      byArtist {
        slug
        count
      }
    }
  }
  ${BOOKING_FIELDS}
`;

export async function fetchBookingList(filter: BookingFilter, page: number, signal?: AbortSignal) {
  return graphqlRequest<{ page: BookingPage; counts: BookingCounts }>(
    BOOKING_LIST_QUERY,
    { filter, page },
    signal,
  );
}

export function readBookingParams(url: URL) {
  const status = url.searchParams.get("status");
  const assignment = url.searchParams.get("for");
  const page = Number(url.searchParams.get("page"));

  return {
    filter: {
      archived: url.searchParams.get("view") === "archived",
      status: isBookingStatus(status) ? status : null,
      assignment: assignment && assignment !== "all" ? assignment : null,
      search: url.searchParams.get("q"),
    },
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function statusTabs(counts: BookingCounts) {
  return [
    { value: "all", label: "All", count: counts.statusTotal },
    ...bookingStatuses.map((status) => ({
      value: status,
      label: statusLabels[status],
      count: counts.byStatus.find((group) => group.status === status)?.count ?? 0,
    })),
  ];
}

export function assignmentTabs(
  counts: BookingCounts,
  choices: { value: string; label: string }[],
  mySlug?: string,
) {
  function countFor(value: string) {
    const slug = value === "none" ? null : value === "mine" ? mySlug : value;
    return counts.byArtist.find((group) => group.slug === slug)?.count ?? 0;
  }

  return [
    { value: "all", label: "Everyone", count: counts.artistTotal },
    ...choices.map((choice) => ({ ...choice, count: countFor(choice.value) })),
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

const ADD_BOOKING_NOTE_MUTATION = /* GraphQL */ `
  mutation AddBookingNote($id: ID!, $text: String!) {
    addBookingNote(id: $id, text: $text) {
      id
    }
  }
`;

export async function addBookingNote(id: string, text: string, signal?: AbortSignal) {
  await graphqlRequest(ADD_BOOKING_NOTE_MUTATION, { id, text }, signal);
}

const bookingIntents = ["status", "archive", "unarchive", "delete", "note"] as const;
type BookingIntent = (typeof bookingIntents)[number];

function isBookingIntent(value: unknown): value is BookingIntent {
  return bookingIntents.includes(value as BookingIntent);
}

export type BookingActionResult = {
  intent: BookingIntent;
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
  const intent = isBookingIntent(rawIntent) ? rawIntent : "status";

  try {
    if (intent === "note") {
      if (!id) {
        return {
          intent,
          error: "Notes can only be added to one request.",
          count: 0,
          updatedTo: null,
        };
      }

      await addBookingNote(id, String(formData.get("text") ?? ""), request.signal);
      return { intent, error: null, count: 1, updatedTo: null };
    }

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
