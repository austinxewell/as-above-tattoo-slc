import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { canUseAdmin, canUseArtist, currentUserContext } from "~/lib/current-user";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(currentUserContext);

  if (canUseAdmin(user)) throw redirect("/portal/admin");
  if (canUseArtist(user)) throw redirect("/portal/artist");

  return null;
}

export default function PortalIndex() {
  return (
    <p className="text-muted-foreground">
      Your account doesn't have access to a dashboard yet. Ask an admin to finish setting it up.
    </p>
  );
}
