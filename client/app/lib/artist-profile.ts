import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type ArtistBookingDetails = {
  minimum: string;
  rate: string;
  deposit: string;
  availability: string;
  notes: string[];
};

export type ArtistProfile = {
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  statement: string;
  imgUrl: string;
  instagram: string | null;
  isBooking: boolean;
  booking: ArtistBookingDetails;
};

export const profileTextFields = ["name", "bio", "statement", "instagram", "imgUrl"] as const;
export type ProfileTextField = (typeof profileTextFields)[number];

export function isProfileTextField(value: string): value is ProfileTextField {
  return (profileTextFields as readonly string[]).includes(value);
}

export const ARTIST_PROFILE_FIELDS = /* GraphQL */ `
  fragment ArtistProfileFields on Artist {
    slug
    name
    specialties
    bio
    statement
    imgUrl
    instagram
    isBooking
    booking {
      minimum
      rate
      deposit
      availability
      notes
    }
  }
`;

const ARTIST_PROFILE_QUERY = /* GraphQL */ `
  query ArtistProfile($slug: String!) {
    artist(slug: $slug) {
      ...ArtistProfileFields
    }
  }
  ${ARTIST_PROFILE_FIELDS}
`;

export async function fetchArtistProfile(slug: string, signal?: AbortSignal) {
  const { artist } = await graphqlRequest<{ artist: ArtistProfile | null }>(
    ARTIST_PROFILE_QUERY,
    { slug },
    signal,
  );
  return artist;
}

export type ArtistSummary = Pick<
  ArtistProfile,
  "slug" | "name" | "imgUrl" | "specialties" | "isBooking"
>;

const ARTIST_SUMMARIES_QUERY = /* GraphQL */ `
  query ArtistSummaries {
    artists {
      slug
      name
      imgUrl
      specialties
      isBooking
    }
  }
`;

export async function fetchArtistSummaries(signal?: AbortSignal) {
  const { artists } = await graphqlRequest<{ artists: ArtistSummary[] }>(
    ARTIST_SUMMARIES_QUERY,
    undefined,
    signal,
  );
  return artists;
}

const UPDATE_ARTIST_MUTATION = /* GraphQL */ `
  mutation UpdateArtist($slug: String!, $input: ArtistUpdateInput!) {
    updateArtist(slug: $slug, input: $input) {
      ...ArtistProfileFields
    }
  }
  ${ARTIST_PROFILE_FIELDS}
`;

export type ArtistProfileInput = Partial<Omit<ArtistProfile, "slug">>;

export async function updateArtistProfile(
  slug: string,
  input: ArtistProfileInput,
  signal?: AbortSignal,
) {
  const { updateArtist } = await graphqlRequest<{ updateArtist: ArtistProfile }>(
    UPDATE_ARTIST_MUTATION,
    { slug, input },
    signal,
  );
  return updateArtist;
}

export type ProfileActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

export async function handleProfileAction(
  request: Request,
  slug: string,
): Promise<ProfileActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === "books") {
      await updateArtistProfile(
        slug,
        { isBooking: formData.get("isBooking") === "true" },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    if (isProfileTextField(intent)) {
      const input: ArtistProfileInput = {};
      input[intent] = String(formData.get("value") ?? "");
      await updateArtistProfile(slug, input, request.signal);
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "specialties") {
      await updateArtistProfile(
        slug,
        { specialties: formData.getAll("specialties").map(String) },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "booking") {
      await updateArtistProfile(
        slug,
        {
          booking: {
            minimum: String(formData.get("minimum") ?? ""),
            rate: String(formData.get("rate") ?? ""),
            deposit: String(formData.get("deposit") ?? ""),
            availability: String(formData.get("availability") ?? ""),
            notes: formData.getAll("notes").map(String),
          },
        },
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
