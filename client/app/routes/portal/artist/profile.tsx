import { data } from "react-router";
import type { Route } from "./+types/profile";
import { currentUserContext } from "~/lib/current-user";
import { fetchArtistProfile, handleProfileAction } from "~/lib/artist-profile";
import { ArtistProfileEditor } from "~/components/portal/artist-profile/artist-profile-editor";

export function meta() {
  return [{ title: "My profile | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request, context }: Route.ClientLoaderArgs) {
  const slug = context.get(currentUserContext).artist?.slug;
  if (!slug) throw data("Not found", { status: 404 });

  const artist = await fetchArtistProfile(slug, request.signal);
  if (!artist) throw data("Not found", { status: 404 });

  return { artist };
}

export async function clientAction({ request, context }: Route.ClientActionArgs) {
  const slug = context.get(currentUserContext).artist?.slug;
  if (!slug) throw data("Not found", { status: 404 });

  return handleProfileAction(request, slug);
}

export default function ArtistProfilePage({ loaderData }: Route.ComponentProps) {
  return <ArtistProfileEditor artist={loaderData.artist} />;
}
