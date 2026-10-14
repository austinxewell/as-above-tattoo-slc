import { useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import type { clientLoader } from "~/routes/portfolio";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PortfolioGallery, type PortfolioPiece } from "./portfolio-gallery";

type PortfolioResultsProps = {
  pieces: PortfolioPiece[];
  nextCursor: string | null;
};

export function PortfolioResults(props: PortfolioResultsProps) {
  const fetcher = useFetcher<typeof clientLoader>();
  const [searchParams] = useSearchParams();
  const [pieces, setPieces] = useState(props.pieces);
  const [nextCursor, setNextCursor] = useState(props.nextCursor);
  const [handledData, setHandledData] = useState(fetcher.data);
  const data = fetcher.data;

  if (data && data !== handledData) {
    setHandledData(data);
    setPieces((current) => [...current, ...data.pieces]);
    setNextCursor(data.nextCursor);
  }

  function loadMore() {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams);
    params.set("after", nextCursor);
    fetcher.load(`/portfolio?${params}`);
  }

  const isLoading = fetcher.state === "loading";

  return (
    <>
      <PortfolioGallery pieces={pieces} />

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
