import type { Route } from "./+types/portfolio";
import { Link } from "react-router";
import { PortfolioFilters } from "~/components/portfolio/portfolio-filters";
import { PortfolioGallery } from "~/components/portfolio/portfolio-gallery";

// Mock Data:
import portfolioData from "~/mocks/portfolio.json";

export function meta() {
  return [
    { title: "Portfolio | As Above Tattoo" },
    {
      name: "description",
      content: "Browse custom tattoo work from the artists at As Above Tattoo in Salt Lake City.",
    },
  ] satisfies Route.MetaDescriptors;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const artist = searchParams.get("artist");
  const style = searchParams.get("style")?.toLowerCase();
  const query = searchParams.get("q")?.trim().toLowerCase();

  const pieces = portfolioData.pieces.filter((piece) => {
    if (artist && piece.artist.slug !== artist) return false;
    if (style && piece.style.toLowerCase() !== style) return false;

    if (query) {
      const searchableText = [piece.style, piece.artist.name, ...piece.tags]
        .join(" ")
        .toLowerCase();
      if (!searchableText.includes(query)) return false;
    }

    return true;
  });

  const allPieces = portfolioData.pieces;

  const artists = Array.from(
    new Map(allPieces.map((piece) => [piece.artist.slug, piece.artist])).values(),
  );

  const styles = Array.from(new Set(allPieces.map((piece) => piece.style))).sort();

  return { pieces, artists, styles };
}

export default function Portfolio({ loaderData }: Route.ComponentProps) {
  return (
    <section
      className="relative isolate overflow-hidden px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="portfolio-title"
    >
      <img
        src="/images/logos/circle-seal.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-4 -right-10 -z-10 w-[28rem] opacity-[0.18] dark:opacity-[0.07]"
      />

      <p className="flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">
        <span>Selected work</span>
        <span className="h-px w-12 bg-accent" aria-hidden="true" />
      </p>

      <h1
        id="portfolio-title"
        className="mt-6 font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl"
      >
        The portfolio
      </h1>

      <p className="mt-6 max-w-md leading-7 text-muted-foreground">
        Every piece is drawn custom. Filter by artist or style, or search for what you have in mind.
      </p>

      <PortfolioFilters artists={loaderData.artists} styles={loaderData.styles} />

      {loaderData.pieces.length > 0 ? (
        <PortfolioGallery pieces={loaderData.pieces} />
      ) : (
        <div className="mt-14 border border-border px-6 py-16 text-center">
          <div className="relative isolate mx-auto mb-8 w-fit p-6">
            <div
              className="absolute inset-0 -z-10 rounded-full bg-accent/15 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 -z-10 rounded-full border border-accent/30"
              aria-hidden="true"
            />

            <img
              src="/images/logos/tarot-card.webp"
              alt=""
              width={700}
              height={1146}
              className="w-24 -rotate-3 shadow-xl shadow-black/50"
            />
          </div>

          <p className="font-display text-2xl">The cards didn't reveal anything.</p>

          <p className="mt-3 text-muted-foreground">
            Try a different artist, style, or search term.
          </p>
          <Link
            to="/portfolio"
            preventScrollReset
            className="mt-6 inline-block border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </section>
  );
}
