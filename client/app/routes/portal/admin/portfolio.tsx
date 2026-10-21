import { useCallback, useState } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import type { Route } from "./+types/portfolio";
import { cn } from "~/lib/utils";
import { fetchArtistSummaries } from "~/lib/artist-profile";
import {
  fetchManagedPortfolio,
  handlePortfolioAction,
  readPortfolioParams,
  type ManagedPiece,
} from "~/lib/portfolio";
import { Button } from "~/components/ui/button";
import { PortfolioFilters } from "~/components/portfolio/portfolio-filters";
import { PortfolioResults } from "~/components/portfolio/portfolio-results";
import { PieceBadges } from "~/components/portal/portfolio/piece-badges";
import { PieceDialog, type PieceTarget } from "~/components/portal/portfolio/piece-dialog";
import { FeatureStar } from "~/components/portal/portfolio/feature-star";
import { FeaturedLegend } from "~/components/portal/portfolio/featured-legend";

export function meta() {
  return [{ title: "Portfolio | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [portfolio, artists] = await Promise.all([
    fetchManagedPortfolio(readPortfolioParams(new URL(request.url)), request.signal),
    fetchArtistSummaries(request.signal),
  ]);

  return { ...portfolio, artists };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handlePortfolioAction(request);
}

export default function AdminPortfolio({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const [editing, setEditing] = useState<PieceTarget>(null);
  const [overrides, setOverrides] = useState<Record<string, ManagedPiece | null>>({});
  const isFiltering =
    navigation.state === "loading" && navigation.location.pathname === location.pathname;
  const hasFilters = ["artist", "style", "q"].some((key) => searchParams.has(key));

  const handleChanged = useCallback((id: string, piece: ManagedPiece | null) => {
    setOverrides((current) => ({ ...current, [id]: piece }));
  }, []);

  const handleDone = useCallback(
    (id: string, piece: ManagedPiece | null) => {
      handleChanged(id, piece);
      setEditing(null);
    },
    [handleChanged],
  );

  const handleClose = useCallback(() => setEditing(null), []);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">Portfolio</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every piece in the shop, including draft artists. Click a piece to edit it.
          </p>
        </div>

        <Button type="button" variant="brand" onClick={() => setEditing("new")}>
          Add piece
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>

      <PortfolioFilters artists={loaderData.artists} styles={loaderData.styles} />

      <FeaturedLegend canFeature />

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
            renderBadges={(piece) => <PieceBadges piece={piece} showFeatured={false} />}
            renderActions={(piece) => <FeatureStar piece={piece} onChanged={handleChanged} />}
            onSelect={setEditing}
            overrides={overrides}
          />
        ) : (
          <p className="mt-14 border border-border px-6 py-16 text-center text-muted-foreground">
            {hasFilters
              ? "No pieces match. Try a different artist, style or search term."
              : "No pieces yet."}
          </p>
        )}
      </div>

      <PieceDialog
        target={editing}
        styles={loaderData.shopStyles}
        artists={loaderData.artists}
        defaultArtist={searchParams.get("artist")}
        onClose={handleClose}
        onDone={handleDone}
      />
    </section>
  );
}
