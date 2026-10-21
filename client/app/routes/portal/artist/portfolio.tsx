import { useCallback, useState } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import type { Route } from "./+types/portfolio";
import { cn } from "~/lib/utils";
import { currentUserContext } from "~/lib/current-user";
import {
  PIECES_TO_PUBLISH,
  fetchManagedPortfolio,
  fetchMyPortfolioStatus,
  handlePortfolioAction,
  readPortfolioParams,
  type ManagedPiece,
} from "~/lib/portfolio";
import { Button } from "~/components/ui/button";
import { PortfolioFilters } from "~/components/portfolio/portfolio-filters";
import { PortfolioResults } from "~/components/portfolio/portfolio-results";
import { PieceBadges } from "~/components/portal/portfolio/piece-badges";
import { PieceDialog, type PieceTarget } from "~/components/portal/portfolio/piece-dialog";
import { FeaturedLegend } from "~/components/portal/portfolio/featured-legend";

export function meta() {
  return [{ title: "My portfolio | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [portfolio, status] = await Promise.all([
    fetchManagedPortfolio(
      { ...readPortfolioParams(new URL(request.url)), mine: true },
      request.signal,
    ),
    fetchMyPortfolioStatus(request.signal),
  ]);

  return { ...portfolio, status };
}

export async function clientAction({ request, context }: Route.ClientActionArgs) {
  const me = context.get(currentUserContext);
  return handlePortfolioAction(request, me.artist?.slug);
}

export default function ArtistPortfolio({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const [editing, setEditing] = useState<PieceTarget>(null);
  const [overrides, setOverrides] = useState<Record<string, ManagedPiece | null>>({});
  const isFiltering =
    navigation.state === "loading" && navigation.location.pathname === location.pathname;
  const hasFilters = searchParams.has("style") || searchParams.has("q");
  const { status } = loaderData;
  const piecesLeft = status ? Math.max(0, PIECES_TO_PUBLISH - status.pieceCount) : 0;

  const handleDone = useCallback((id: string, piece: ManagedPiece | null) => {
    setOverrides((current) => ({ ...current, [id]: piece }));
    setEditing(null);
  }, []);

  const handleClose = useCallback(() => setEditing(null), []);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl uppercase">My portfolio</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            This is how your work appears on the site. Click any piece to edit or delete it.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          {status && !status.isPublished && (
            <div className="min-w-52">
              <p className="text-sm">
                <span className="tabular-nums">{status.pieceCount}</span>{" "}
                {status.pieceCount === 1 ? "piece" : "pieces"} ·{" "}
                {piecesLeft > 0 ? `${piecesLeft} more to publish your page` : "enough to publish"}
              </p>
              <div aria-hidden="true" className="mt-2 h-1 bg-surface-raised">
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${Math.min(100, (status.pieceCount / PIECES_TO_PUBLISH) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <Button type="button" variant="brand" onClick={() => setEditing("new")}>
            Add piece
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <PortfolioFilters
        artists={[]}
        styles={loaderData.styles}
        searchPlaceholder="Search by keyword or style"
      />

      <FeaturedLegend canFeature={false} />

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
            renderBadges={(piece) => <PieceBadges piece={piece} showFeatured />}
            onSelect={setEditing}
            overrides={overrides}
          />
        ) : (
          <p className="mt-14 border border-border px-6 py-16 text-center text-muted-foreground">
            {hasFilters
              ? "No pieces match. Try a different style or search term."
              : "No pieces yet. Use Add piece to add your first one."}
          </p>
        )}
      </div>

      <PieceDialog
        target={editing}
        styles={loaderData.shopStyles}
        onClose={handleClose}
        onDone={handleDone}
      />
    </section>
  );
}
