import type { Route } from "./+types/artists";
import { fetchArtistSummaries } from "~/lib/artist-profile";
import { ArtistCard } from "~/components/portal/artist-profile/artist-card";
import { AddPersonDialog } from "~/components/portal/staff/add-person-dialog";
import { fetchStaff } from "~/lib/staff";

export function meta() {
  return [{ title: "Artists | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [artists, staff] = await Promise.all([
    fetchArtistSummaries(request.signal),
    fetchStaff(request.signal),
  ]);

  const loginBySlug = new Map(
    staff.flatMap((member) =>
      member.artist
        ? [[member.artist.slug, member.hasPassword ? "active" : "pending"] as const]
        : [],
    ),
  );

  return {
    artists: artists.map((artist) => ({ artist, login: loginBySlug.get(artist.slug) ?? null })),
  };
}

export default function AdminArtists({ loaderData }: Route.ComponentProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">Artists</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Pick an artist to update their profile, photo, rates, or books.
          </p>
        </div>
        <AddPersonDialog triggerLabel="New artist" fixedRole="artist" />
      </div>

      {loaderData.artists.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loaderData.artists.map(({ artist, login }) => (
            <li key={artist.slug}>
              <ArtistCard artist={artist} login={login} />
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
