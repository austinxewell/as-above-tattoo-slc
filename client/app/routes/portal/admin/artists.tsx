import type { Route } from "./+types/artists";
import { fetchArtistSummaries } from "~/lib/artist-profile";
import { ArtistCard } from "~/components/portal/artist-profile/artist-card";

export function meta() {
  return [{ title: "Artists | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { artists: await fetchArtistSummaries(request.signal) };
}

export default function AdminArtists({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <h1 className="font-display text-3xl uppercase">Artists</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Pick an artist to update their profile, photo, rates, or books.
      </p>

      {loaderData.artists.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loaderData.artists.map((artist) => (
            <li key={artist.slug}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 border border-border px-6 py-12 text-center text-muted-foreground">
          No artists yet.
        </p>
      )}
    </section>
  );
}
