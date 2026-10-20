import { graphqlRequest, GraphQLRequestError } from "~/lib/graphql";

export type StaffRole = "admin" | "artist";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  hasPassword: boolean;
  artist: { slug: string; name: string; isPublished: boolean } | null;
};

export const roleLabels: Record<StaffRole, string> = {
  admin: "Admin",
  artist: "Artist",
};

const STAFF_QUERY = /* GraphQL */ `
  query Staff {
    users {
      id
      name
      email
      role
      hasPassword
      artist {
        slug
        name
        isPublished
      }
    }
  }
`;

export async function fetchStaff(signal?: AbortSignal) {
  const { users } = await graphqlRequest<{ users: StaffMember[] }>(STAFF_QUERY, undefined, signal);
  return users;
}

const SEND_INVITE_MUTATION = /* GraphQL */ `
  mutation SendInvite($userId: ID!) {
    sendInvite(userId: $userId)
  }
`;

const ADD_ARTIST_PROFILE_MUTATION = /* GraphQL */ `
  mutation AddArtistProfile($userId: ID!) {
    addArtistProfile(userId: $userId) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export type StaffActionResult = {
  intent: string;
  ok: boolean;
  error: string | null;
  field: string | null;
};

export async function handleStaffAction(request: Request): Promise<StaffActionResult> {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const userId = String(formData.get("userId") ?? "");

  try {
    if (intent === "create") {
      await graphqlRequest(
        CREATE_USER_MUTATION,
        {
          input: {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            role: formData.get("role") === "admin" ? "admin" : "artist",
            withArtistProfile: formData.get("withArtistProfile") === "on,",
          },
        },
        request.signal,
      );
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "invite") {
      await graphqlRequest(SEND_INVITE_MUTATION, { userId }, request.signal);
      return { intent, ok: true, error: null, field: null };
    }

    if (intent === "add-profile") {
      await graphqlRequest(ADD_ARTIST_PROFILE_MUTATION, { userId }, request.signal);
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
