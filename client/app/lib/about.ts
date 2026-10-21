import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type AboutValue = {
  id: string;
  title: string;
  description: string;
};

export type About = {
  heading: string;
  body: string;
  values: AboutValue[];
};

const ABOUT_FIELDS = /* GraphQL */ `
  fragment AboutFields on About {
    heading
    body
    values {
      id
      title
      description
    }
  }
`;

const ABOUT_QUERY = /* GraphQL */ `
  query About {
    about {
      ...AboutFields
    }
  }
  ${ABOUT_FIELDS}
`;

const UPDATE_ABOUT_MUTATION = /* GraphQL */ `
  mutation UpdateAbout($input: AboutInput!) {
    updateAbout(input: $input) {
      ...AboutFields
    }
  }
  ${ABOUT_FIELDS}
`;

export async function fetchAbout(signal?: AbortSignal) {
  const { about } = await graphqlRequest<{ about: About }>(ABOUT_QUERY, undefined, signal);
  return about;
}

export type AboutActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

function readValues(formData: FormData) {
  const titles = formData.getAll("title").map(String);
  const descriptions = formData.getAll("description").map(String);
  return titles.map((title, index) => ({ title, description: descriptions[index] ?? "" }));
}

export async function handleAboutAction(request: Request): Promise<AboutActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === "heading" || intent === "body") {
      await graphqlRequest(
        UPDATE_ABOUT_MUTATION,
        { input: { [intent]: String(formData.get("value") ?? "") } },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "values") {
      await graphqlRequest(
        UPDATE_ABOUT_MUTATION,
        { input: { values: readValues(formData) } },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    return { intent, ok: false, error: "That change isn't supported.", field: null };
  } catch (error) {
    return {
      intent,
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      field: error instanceof GraphQLRequestError ? (error.field ?? null) : null,
    };
  }
}
