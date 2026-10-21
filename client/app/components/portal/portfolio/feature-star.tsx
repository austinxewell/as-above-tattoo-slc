import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ManagedPiece, PortfolioActionResult } from "~/lib/portfolio";

type FeatureStarProps = {
  piece: ManagedPiece;
  onChanged: (id: string, piece: ManagedPiece | null) => void;
};

export function FeatureStar({ piece, onChanged }: FeatureStarProps) {
  const fetcher = useFetcher<PortfolioActionResult>();
  const pendingIntent = fetcher.formData?.get("intent");
  const isFeatured = pendingIntent ? pendingIntent === "feature" : piece.isFeatured;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok && fetcher.data.piece) {
      onChanged(fetcher.data.piece.id, fetcher.data.piece);
    }
  }, [fetcher.state, fetcher.data, onChanged]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="id" value={piece.id} />
      <button
        type="submit"
        name="intent"
        value={isFeatured ? "unfeature" : "feature"}
        aria-pressed={isFeatured}
        aria-label="Featured on the home page"
        title={isFeatured ? "Remove from the home page" : "Feature on the home page"}
        className={cn(
          "grid size-8 place-items-center border backdrop-blur-sm transition-colors",
          isFeatured
            ? "border-accent bg-accent text-accent-foreground"
            : "border-[#f2ede4]/40 bg-black/45 text-[#f2ede4] hover:border-accent",
        )}
      >
        <Star
          className="size-4"
          fill={isFeatured ? "currentColor" : "none"}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
    </fetcher.Form>
  );
}
