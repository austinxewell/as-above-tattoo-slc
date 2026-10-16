import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { graphqlRequest } from "~/lib/graphql";

const LOGOUT_MUTATION = /* GraphQL */ `
  mutation Logout {
    logout
  }
`;

export async function clientAction({ request }: Route.ClientActionArgs) {
  await graphqlRequest(LOGOUT_MUTATION, undefined, request.signal);
  return redirect("/login");
}
