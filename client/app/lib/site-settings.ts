import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type PublishingStandards = {
  photo: boolean;
  bio: boolean;
  statement: boolean;
  instagram: boolean;
  booking: boolean;
  minSpecialties: number;
  minPieces: number;
};

export type SiteSettings = {
  bookingRequestsEnabled: boolean;
  publishing: PublishingStandards;
};

const SITE_SETTINGS_FIELDS = /* GraphQL */ `
  fragment SiteSettingsFields on SiteSettings {
    bookingRequestsEnabled
    publishing {
      photo
      bio
      statement
      instagram
      booking
      minSpecialties
      minPieces
    }
  }
`;

const SITE_SETTINGS_QUERY = /* GraphQL */ `
  query SiteSettings {
    siteSettings {
      ...SiteSettingsFields
    }
  }
  ${SITE_SETTINGS_FIELDS}
`;

const UPDATE_SITE_SETTINGS_MUTATION = /* GraphQL */ `
  mutation UpdateSiteSettings($input: SiteSettingsInput!) {
    updateSiteSettings(input: $input) {
      ...SiteSettingsFields
    }
  }
  ${SITE_SETTINGS_FIELDS}
`;

export async function fetchSiteSettings(signal?: AbortSignal) {
  const { siteSettings } = await graphqlRequest<{ siteSettings: SiteSettings }>(
    SITE_SETTINGS_QUERY,
    undefined,
    signal,
  );
  return siteSettings;
}

export type SiteSettingsActionResult = {
  intent: "booking" | "standards" | null;
  ok: boolean;
  error: string | null;
  field: string | null;
};

export async function handleSiteSettingsAction(
  request: Request,
): Promise<SiteSettingsActionResult> {
  const formData = await request.formData();
  const rawIntent = formData.get("intent");
  const intent = rawIntent === "booking" || rawIntent === "standards" ? rawIntent : null;

  try {
    if (intent === "booking") {
      await graphqlRequest(
        UPDATE_SITE_SETTINGS_MUTATION,
        { input: { bookingRequestsEnabled: formData.get("enabled") === "true" } },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "standards") {
      const publishing = {
        ...Object.fromEntries(
          (["photo", "bio", "statement", "instagram", "booking"] as const).map((key) => [
            key,
            formData.get(key) === "on",
          ]),
        ),
        minSpecialties: Number(formData.get("minSpecialties")),
        minPieces: Number(formData.get("minPieces")),
      };

      await graphqlRequest(
        UPDATE_SITE_SETTINGS_MUTATION,
        { input: { publishing } },
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
