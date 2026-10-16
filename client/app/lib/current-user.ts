import { createContext } from "react-router";
import { graphqlRequest } from "~/lib/graphql";

export type CurrentUser = {
  id: string;
  name: string;
  role: "admin" | "artist";
  artist: { slug: string; name: string } | null;
};

export const currentUserContext = createContext<CurrentUser>();

const ME_QUERY = /* GraphQL */ `
  query Me {
    me {
      id
      name
      role
      artist {
        slug
        name
      }
    }
  }
`;

export async function fetchCurrentUser(signal?: AbortSignal) {
  const { me } = await graphqlRequest<{ me: CurrentUser | null }>(ME_QUERY, undefined, signal);
  return me;
}

export function canUseAdmin(user: CurrentUser) {
  return user.role === "admin";
}

export function canUseArtist(user: CurrentUser) {
  return user.artist !== null;
}
