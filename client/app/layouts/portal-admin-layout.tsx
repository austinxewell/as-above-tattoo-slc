import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/portal-admin-layout";
import { canUseAdmin, currentUserContext } from "~/lib/current-user";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  if (!canUseAdmin(context.get(currentUserContext))) throw redirect("/portal");
  return null;
}

export default function PortalAdminLayout() {
  return <Outlet />;
}
