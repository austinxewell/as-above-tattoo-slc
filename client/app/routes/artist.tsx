import { data } from "react-router";
import type { Route } from "./+types/artist";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "~/components/shared/page-header";
import { ArtistInfo } from "~/components/artists/artist-info";
import { ArtistBooking } from "~/components/artists/artist-booking";
import { PortfolioGallery } from "~/components/portfolio/portfolio-gallery";

// Moke Data:
import artistsData from "~/mocks/artists.json";
import portfolioData from "~/mocks/portfolio.json";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const artist = artistsData.artists.find((candidate) => candidate.slug === params.slug);

  if (!artist) {
    throw data("Artist not found", { status: 404 });
  }

  const pieces = portfolioData.pieces.filter((piece) => piece.artist.slug === artist.slug);

  const otherArtists = artistsData.artists.filter((candidate) => candidate.slug !== artist.slug);

  return { artist, pieces, otherArtists };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData?.artist.name ?? "Artist"} | As Above Tattoo` },
    {
      name: "description",
      content: loaderData ? loaderData.artist.bio : "Artist at As Above Tattoo in Salt Lake City.",
    },
  ] satisfies Route.MetaDescriptors;
}

export default function Artist({ loaderData }: Route.ComponentProps) {
  const { artist } = loaderData;

  return (
    <>
      <section
        className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="artist-title"
      >
        <img
          src="/images/logos/artist-badge.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 -right-10 -z-10 w-[26rem] rotate-12 opacity-[0.18] dark:opacity-[0.07]"
        />

        <Link
          to="/artists"
          className="inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          All artists
        </Link>

        <div className="mt-10">
          <PageHeader eyebrow="Artist profile" title={artist.name} titleId="artist-title" />
        </div>

        <div className="mt-14 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden border border-border">
            <img
              src={artist.imgUrl}
              alt={`Portrait of ${artist.name}`}
              className="aspect-[4/5] w-full object-cover saturate-[0.65] contrast-[1.08]"
            />
          </div>

          <div>
            <ArtistInfo artist={artist} workHref="#work" />
          </div>
        </div>
      </section>

      <section className="border-t border-accent/30 px-6 py-20 md:px-[6.2vw] md:py-28">
        <figure className="mx-auto max-w-3xl text-center">
          <span className="font-display text-6xl leading-none text-accent" aria-hidden="true">
            &ldquo;
          </span>

          <blockquote>
            <p className="font-display text-2xl italic leading-snug md:text-4xl">
              {artist.statement}
            </p>
          </blockquote>

          <figcaption className="mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {artist.name}
          </figcaption>
        </figure>
      </section>

      <ArtistBooking
        name={artist.name}
        slug={artist.slug}
        isBooking={artist.isBooking}
        booking={artist.booking}
      />

      <section
        id="work"
        className="scroll-mt-28 border-t border-accent/30 px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="work-title"
      >
        <h2
          id="work-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Work by {artist.name.split(" ")[0]}
        </h2>

        {loaderData.pieces.length > 0 ? (
          <PortfolioGallery pieces={loaderData.pieces} />
        ) : (
          <p className="mt-6 text-muted-foreground">New work from {artist.name} is coming soon.</p>
        )}
      </section>

      <section
        className="bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
        aria-labelledby="other-artists-title"
      >
        <h2
          id="other-artists-title"
          className="font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
        >
          Meet the other artists
        </h2>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loaderData.otherArtists.map((other) => (
            <li key={other.id}>
              <Link to={`/artists/${other.slug}`} className="group block">
                <div className="overflow-hidden border border-border">
                  <img
                    src={other.imgUrl}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover saturate-[0.65] contrast-[1.08] transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-100"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl">{other.name}</h3>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.17em] text-muted-foreground">
                  {other.specialties.join(" & ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
