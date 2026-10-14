import type { Route } from "./+types/portfolio";
import { Link, useLocation, useNavigation } from "react-router";
import { graphqlRequest } from "~/lib/graphql";
import { cn } from "~/lib/utils";
import type { PortfolioPiece } from "~/components/portfolio/portfolio-gallery";
import { PageHeader } from "~/components/shared/page-header";
import { PortfolioFilters } from "~/components/portfolio/portfolio-filters";
import { PortfolioResults } from "~/components/portfolio/portfolio-results";
import { BrandLoader } from "~/components/shared/brand-loader";

const PORTFOLIO_QUERY = /* GraphQL */ `
  query Portfolio($artist: String, $style: String, $search: String, $after: String) {
    pieces(artist: $artist, style: $style, search: $search, after: $after) {
      items {
        id
        imgUrl
        style
        tags
        artist {
          id
          name
          slug
        }
      }
      nextCursor
    }
    pieceStyles
    artists {
      slug
      name
    }
  }
`;

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

  const { pieces, pieceStyles, artists } = await graphqlRequest<{
    pieces: { items: PortfolioPiece[]; nextCursor: string | null };
    pieceStyles: string[];
    artists: { slug: string; name: string }[];
  }>(
    PORTFOLIO_QUERY,
    {
      artist: searchParams.get("artist"),
      style: searchParams.get("style"),
      search: searchParams.get("q"),
      after: searchParams.get("after"),
    },
    request.signal,
  );

  return { pieces: pieces.items, nextCursor: pieces.nextCursor, artists, styles: pieceStyles };
}

export default function Portfolio({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isFiltering =
    navigation.state === "loading" && navigation.location.pathname === "/portfolio";

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

      <PageHeader
        eyebrow="Selected work"
        title="The portfolio"
        titleId="portfolio-title"
        description="Every piece is drawn custom. Filter by artist or style, or search for what you have in mind."
      />

      <PortfolioFilters artists={loaderData.artists} styles={loaderData.styles} />

      <div className="relative">
        {isFiltering && (
          <div role="status" className="absolute inset-0 z-10">
            <div className="sticky top-1/4 flex justify-center pt-10">
              <BrandLoader />
              <span className="sr-only">Loading pieces</span>
            </div>
          </div>
        )}

        <div
          aria-busy={isFiltering}
          className={cn(
            "transition-opacity duration-300",
            isFiltering && "pointer-events-none opacity-40",
          )}
        >
          {loaderData.pieces.length > 0 ? (
            <PortfolioResults
              key={location.search}
              pieces={loaderData.pieces}
              nextCursor={loaderData.nextCursor}
            />
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
        </div>
      </div>
    </section>
  );
}
