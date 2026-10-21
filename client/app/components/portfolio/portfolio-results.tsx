import { useState, type ReactNode } from "react";
import { useFetcher, useLocation, useSearchParams } from "react-router";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PortfolioGallery, type PortfolioPiece } from "./portfolio-gallery";

type PortfolioResultsProps<T extends PortfolioPiece> = {
  pieces: T[];
  nextCursor: string | null;
  renderBadges?: (piece: T) => ReactNode;
  renderActions?: (piece: T) => ReactNode;
  onSelect?: (piece: T) => void;
  overrides?: Record<string, T | null>;
};

export function PortfolioResults<T extends PortfolioPiece>(props: PortfolioResultsProps<T>) {
  const fetcher = useFetcher<{ pieces: T[]; nextCursor: string | null }>();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [extraPieces, setExtraPieces] = useState<T[]>([]);
  const [extraCursor, setExtraCursor] = useState<string | null>(null);
  const [handledData, setHandledData] = useState(fetcher.data);
  const data = fetcher.data;

  if (data && data !== handledData) {
    setHandledData(data);
    setExtraPieces((current) => [...current, ...data.pieces]);
    setExtraCursor(data.nextCursor);
  }

  // Page 1 always comes fresh from the loader; later pages come from Load more.
  const nextCursor = extraPieces.length > 0 ? extraCursor : props.nextCursor;
  const firstPageIds = new Set(props.pieces.map((piece) => piece.id));
  const overrides = props.overrides ?? {};

  const pieces = [
    ...props.pieces,
    ...extraPieces.filter((piece) => !firstPageIds.has(piece.id)),
  ].flatMap((piece) => {
    if (!(piece.id in overrides)) return [piece];
    const replacement = overrides[piece.id];
    return replacement ? [replacement] : [];
  });

  function loadMore() {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams);
    params.set("after", nextCursor);
    fetcher.load(`${pathname}?${params}`);
  }

  const isLoading = fetcher.state === "loading";

  return (
    <>
      <PortfolioGallery
        pieces={pieces}
        renderBadges={props.renderBadges}
        renderActions={props.renderActions}
        onSelect={props.onSelect}
      />

      {nextCursor && (
        <div className="mt-14 flex justify-center">
          <Button variant="brand" size="cta" onClick={loadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                Loading more
                <LoaderCircle
                  className="size-4 animate-spin"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </>
            ) : (
              <>
                Load more
                <ArrowDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
