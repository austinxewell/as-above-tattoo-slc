import type { Route } from "./+types/artists";
import { graphqlRequest } from "~/lib/graphql";
import type { Artist } from "~/components/artists/artist-list";
import { PageHeader } from "~/components/shared/page-header";
import { ArtistList } from "~/components/artists/artist-list";

const ARTISTS_QUERY = /* GraphQL */ `
  query Artists {
    artists {
      id
      slug
      name
      specialties
      bio
      imgUrl
      instagram
      isBooking
    }
  }
`;

export function meta() {
  return [
    { title: "Artists | As Above Tattoo" },
    { name: "description", content: "Browse the artists at As Above Tattoo in Salt Lake City." },
  ] satisfies Route.MetaDescriptors;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { artists } = await graphqlRequest<{ artists: Artist[] }>(
    ARTISTS_QUERY,
    undefined,
    request.signal,
  );
  return { artists };
}

export default function Artists({ loaderData }: Route.ComponentProps) {
  return (
    <section
      className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="artists-title"
    >
      <img
        src="/images/logos/tarot-card-transparent.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-4 -right-10 -z-10 w-[20rem] opacity-[0.18] dark:opacity-[0.07] -rotate-20"
      />

      <PageHeader
        eyebrow="The studio"
        title="The artists"
        titleId="artists-title"
        description="Every piece deserves the right artist. Find the one whose style fits your idea."
      />

      <ArtistList artists={loaderData.artists} />
    </section>
  );
}
