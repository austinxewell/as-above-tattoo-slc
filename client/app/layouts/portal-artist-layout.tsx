import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/portal-artist-layout";
import { canUseArtist, currentUserContext } from "~/lib/current-user";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  if (!canUseArtist(context.get(currentUserContext))) throw redirect("/portal");
  return null;
}

export default function PortalArtistLayout() {
  return <Outlet />;
}
