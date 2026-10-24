import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { DialogCloseButton } from "~/components/shared/dialog-close-button";
import { FadeInImage } from "~/components/shared/fade-in-image";
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

  return (
    <>
      <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {pieces.map((piece) => (
          <li key={piece.id} className="aspect-square">
            <figure className="relative h-full overflow-hidden border border-border bg-surface-raised">
              <button
                type="button"
                onClick={() => {
                  if (onSelect) {
                    onSelect(piece);
                    return;
                  }
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full sm:w-auto max-w-[calc(100%-2rem)] gap-3 rounded-none border border-border bg-background p-3 sm:max-w-5xl"
        >
          {selectedPiece && (
            <>
              <DialogTitle className="sr-only">
                {selectedPiece.style} tattoo by {selectedPiece.artist.name}
              </DialogTitle>

              <img
                src={sizedImage(selectedPiece.imgUrl, 1600)}
                alt={`${selectedPiece.style} tattoo by ${selectedPiece.artist.name}`}
                className="max-h-[80vh] w-full sm:w-auto object-contain"
              />

              <DialogCloseButton />

              <p className="flex justify-between gap-4 text-[0.65rem] uppercase tracking-[0.15em]">
                <span>{selectedPiece.style}</span>
                <span className="text-muted-foreground">{selectedPiece.artist.name}</span>
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
