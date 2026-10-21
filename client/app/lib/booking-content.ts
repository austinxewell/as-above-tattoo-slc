import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type BookingStep = {
  id: string;
  title: string;
  description: string;
};

export type BookingContent = {
  intro: string;
  steps: BookingStep[];
  whyRequest: string;
  disclaimer: string;
};

const BOOKING_CONTENT_FIELDS = /* GraphQL */ `
  fragment BookingContentFields on BookingContent {
    intro
    steps {
      id
      title
      description
    }
    whyRequest
    disclaimer
  }
`;

const BOOKING_CONTENT_QUERY = /* GraphQL */ `
  query BookingContentEditor {
    bookingContent {
      ...BookingContentFields
    }
    bookingRequestsEnabled
  }
  ${BOOKING_CONTENT_FIELDS}
`;

const UPDATE_BOOKING_CONTENT_MUTATION = /* GraphQL */ `
  mutation UpdateBookingContent($input: BookingContentInput!) {
    updateBookingContent(input: $input) {
      ...BookingContentFields
    }
  }
  ${BOOKING_CONTENT_FIELDS}
`;

export async function fetchBookingContent(signal?: AbortSignal) {
  return graphqlRequest<{ bookingContent: BookingContent; bookingRequestsEnabled: boolean }>(
    BOOKING_CONTENT_QUERY,
    undefined,
    signal,
  );
}

export type BookingContentActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

const textFields = ["intro", "whyRequest", "disclaimer"];

function readInput(intent: string, formData: FormData) {
  if (textFields.includes(intent)) {
    return { [intent]: String(formData.get("value") ?? "") };
  }

  if (intent === "steps") {
    const titles = formData.getAll("title").map(String);
    const descriptions = formData.getAll("description").map(String);
    return {
      steps: titles.map((title, index) => ({ title, description: descriptions[index] ?? "" })),
    };
  }

  return null;
}

export async function handleBookingContentAction(
  request: Request,
): Promise<BookingContentActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const input = readInput(intent, formData);

  if (!input) {
    return { intent, ok: false, error: "That change isn't supported.", field: null };
  }

  try {
    await graphqlRequest(UPDATE_BOOKING_CONTENT_MUTATION, { input }, request.signal);
    return { intent, ok: true, error: null, field: null };
  } catch (error) {
    return {
      intent,
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      field: error instanceof GraphQLRequestError ? (error.field ?? null) : null,
    };
  }
}
