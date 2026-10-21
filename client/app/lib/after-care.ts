import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type AfterCareStage = {
  id: string;
  timeframe: string;
  title: string;
  steps: string[];
};

export type AfterCareMethod = {
  id: string;
  slug: string;
  name: string;
  description: string;
  stages: AfterCareStage[];
};

export type AfterCare = {
  intro: string;
  disclaimer: string;
  methods: AfterCareMethod[];
  dos: string[];
  donts: string[];
  warningSigns: string[];
};

// What the server accepts for a method. A new method has no slug yet.
export type MethodInput = {
  slug?: string;
  name: string;
  description: string;
  stages: { timeframe: string; title: string; steps: string[] }[];
};

export function toMethodInput(method: AfterCareMethod): MethodInput {
  return {
    slug: method.slug,
    name: method.name,
    description: method.description,
    stages: method.stages.map(({ timeframe, title, steps }) => ({ timeframe, title, steps })),
  };
}

const AFTER_CARE_FIELDS = /* GraphQL */ `
  fragment AfterCareFields on AfterCare {
    intro
    disclaimer
    methods {
      id
      slug
      name
      description
      stages {
        id
        timeframe
        title
        steps
      }
    }
    dos
    donts
    warningSigns
  }
`;

const AFTER_CARE_QUERY = /* GraphQL */ `
  query AfterCareEditor {
    afterCare {
      ...AfterCareFields
    }
  }
  ${AFTER_CARE_FIELDS}
`;

const UPDATE_AFTER_CARE_MUTATION = /* GraphQL */ `
  mutation UpdateAfterCare($input: AfterCareInput!) {
    updateAfterCare(input: $input) {
      ...AfterCareFields
    }
  }
  ${AFTER_CARE_FIELDS}
`;

export async function fetchAfterCare(signal?: AbortSignal) {
  const { afterCare } = await graphqlRequest<{ afterCare: AfterCare }>(
    AFTER_CARE_QUERY,
    undefined,
    signal,
  );
  return afterCare;
}

export type AfterCareActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

function readInput(intent: string, formData: FormData) {
  if (intent === "intro" || intent === "disclaimer") {
    return { [intent]: String(formData.get("value") ?? "") };
  }

  if (intent === "dos" || intent === "donts" || intent === "warningSigns") {
    return { [intent]: formData.getAll("items").map(String) };
  }

  if (intent === "methods") {
    // Methods are nested (stages inside methods, steps inside stages), so the
    // editor sends them as one JSON field. The server validates every value.
    return { methods: JSON.parse(String(formData.get("methods") ?? "[]")) as MethodInput[] };
  }

  return null;
}

export async function handleAfterCareAction(request: Request): Promise<AfterCareActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    const input = readInput(intent, formData);

    if (!input) {
      return { intent, ok: false, error: "That change isn't supported.", field: null };
    }

    await graphqlRequest(UPDATE_AFTER_CARE_MUTATION, { input }, request.signal);
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
