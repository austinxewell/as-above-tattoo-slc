import { data, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/artist";
import { fetchArtistProfile, handleProfileAction } from "~/lib/artist-profile";
import { ArtistProfileEditor } from "~/components/portal/artist-profile/artist-profile-editor";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData?.artist.name ?? "Artist"} | Portal` },
    { name: "robots", content: "noindex" },
  ];
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const artist = await fetchArtistProfile(params.slug, request.signal);
  if (!artist) throw data("Not found", { status: 404 });

  return { artist };
}

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  return handleProfileAction(request, params.slug);
}

export default function AdminArtist({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Link
        to="/portal/admin/artists"
        className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        All artists
      </Link>

      <div className="mt-8">
        <ArtistProfileEditor
          key={loaderData.artist.slug}
          artist={loaderData.artist}
          eyebrow="Artist profile"
        />
      </div>
    </>
  );
}
