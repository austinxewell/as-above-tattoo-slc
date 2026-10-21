import { Star } from "lucide-react";
import type { ManagedPiece } from "~/lib/portfolio";

const badgeClasses =
  "inline-flex items-center gap-1 bg-black/65 px-2 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-[#f2ede4] backdrop-blur-sm";

type PieceBadgesProps = {
  piece: ManagedPiece;
  showFeatured: boolean;
};

export function PieceBadges({ piece, showFeatured }: PieceBadgesProps) {
  return (
    <>
      {!piece.artist.isPublished && (
        <span className={badgeClasses}>
          Draft<span className="sr-only"> (not on the site yet)</span>
        </span>
      )}
      {showFeatured && piece.isFeatured && (
        <span className={badgeClasses}>
          <Star className="size-2.5" fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          Featured<span className="sr-only"> on the home page</span>
        </span>
      )}
    </>
  );
}
