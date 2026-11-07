import { useState, type ReactNode } from "react";
import { FadeInImage } from "~/components/shared/fade-in-image";
import { PieceLightbox } from "~/components/portfolio/piece-lightbox";
import { sizedImage } from "~/lib/image-url";

export type PortfolioPiece = {
  id: string;
  imgUrl: string;
  style: string;
  artist: { id: string; name: string; slug: string };
  tags: string[];
};

type PortfolioGalleryProps<T extends PortfolioPiece> = {
  pieces: T[];
  renderBadges?: (piece: T) => ReactNode;
  renderActions?: (piece: T) => ReactNode;
  onSelect?: (piece: T) => void;
};

export function PortfolioGallery<T extends PortfolioPiece>({
  pieces,
  renderBadges,
  renderActions,
  onSelect,
}: PortfolioGalleryProps<T>) {
  const [selectedPiece, setSelectedPiece] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

  return (
    <>
      <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {pieces.map((piece) => (
          <li key={piece.id} className="aspect-square">
            <figure className="relative h-full overflow-hidden border border-border bg-surface-raised">
              <button
                type="button"
                onClick={(event) => {
                  if (onSelect) {
                    onSelect(piece);
                    return;
                  }
                  const tile = event.currentTarget.querySelector("img");
                  setSelectedRatio(
                    tile?.naturalWidth ? tile.naturalWidth / tile.naturalHeight : null,
                  );
                  setSelectedPiece(piece);
                  setIsOpen(true);
                }}
                aria-label={
                  onSelect
                    ? `Edit ${piece.style} piece by ${piece.artist.name}`
                    : `Enlarge ${piece.style} tattoo by ${piece.artist.name}`
                }
                className={`group block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${onSelect ? "cursor-pointer" : "cursor-zoom-in"}`}
              >
                <FadeInImage
                  src={sizedImage(piece.imgUrl, 800)}
                  alt={`${piece.style} tattoo by ${piece.artist.name}`}
                  className="h-full w-full object-contain saturate-[0.65] contrast-[1.08] group-hover:scale-105 group-hover:saturate-100 group-focus-visible:saturate-100"
                />
              </button>

              {renderBadges && (
                <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1.5">
                  {renderBadges(piece)}
                </div>
              )}

              {renderActions && (
                <div className="absolute top-2 right-2 flex gap-1.5">{renderActions(piece)}</div>
              )}

              <figcaption className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 pt-8 pb-3 text-[0.6rem] uppercase tracking-[0.15em] text-[#f2ede4] md:text-[0.65rem] pointer-events-none">
                <span>{piece.style}</span>
                <span className="text-[#f2ede4]/70">{piece.artist.name}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <PieceLightbox
        piece={selectedPiece}
        ratio={selectedRatio}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
