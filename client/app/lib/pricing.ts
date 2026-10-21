import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type PricingTitledItem = {
  id: string;
  title: string;
  description: string;
};

export type PricingFaq = {
  id: string;
  question: string;
  answer: string;
};

export type Pricing = {
  intro: string;
  shopMinimum: string;
  factors: PricingTitledItem[];
  policies: PricingTitledItem[];
  faqs: PricingFaq[];
};

const PRICING_FIELDS = /* GraphQL */ `
  fragment PricingFields on Pricing {
    intro
    shopMinimum
    factors {
      id
      title
      description
    }
    policies {
      id
      title
      description
    }
    faqs {
      id
      question
      answer
    }
  }
`;

const PRICING_QUERY = /* GraphQL */ `
  query Pricing {
    pricing {
      ...PricingFields
    }
  }
  ${PRICING_FIELDS}
`;

const UPDATE_PRICING_MUTATION = /* GraphQL */ `
  mutation UpdatePricing($input: PricingInput!) {
    updatePricing(input: $input) {
      ...PricingFields
    }
  }
  ${PRICING_FIELDS}
`;

export async function fetchPricing(signal?: AbortSignal) {
  const { pricing } = await graphqlRequest<{ pricing: Pricing }>(PRICING_QUERY, undefined, signal);
  return pricing;
}

export type PricingActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

// Pairs up repeated form fields by position, e.g. every "title" with every "description".
function readPairs<A extends string, B extends string>(formData: FormData, first: A, second: B) {
  const firsts = formData.getAll(first).map(String);
  const seconds = formData.getAll(second).map(String);
  return firsts.map(
    (value, index) => ({ [first]: value, [second]: seconds[index] ?? "" }) as Record<A | B, string>,
  );
}

function readInput(intent: string, formData: FormData) {
  if (intent === "intro" || intent === "shopMinimum") {
    return { [intent]: String(formData.get("value") ?? "") };
  }
  if (intent === "factors" || intent === "policies") {
    return { [intent]: readPairs(formData, "title", "description") };
  }
  if (intent === "faqs") {
    return { faqs: readPairs(formData, "question", "answer") };
  }
  return null;
}

export async function handlePricingAction(request: Request): Promise<PricingActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const input = readInput(intent, formData);

  if (!input) {
    return { intent, ok: false, error: "That change isn't supported.", field: null };
  }

  try {
    await graphqlRequest(UPDATE_PRICING_MUTATION, { input }, request.signal);
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
