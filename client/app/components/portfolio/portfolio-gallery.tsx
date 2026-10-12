import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { X } from "lucide-react";

export type PortfolioPiece = {
  id: number;
  imgUrl: string;
  style: string;
  artist: { id: number; name: string; slug: string };
  tags: string[];
};

type PortfolioGalleryProps = {
  pieces: PortfolioPiece[];
};

export function PortfolioGallery({ pieces }: PortfolioGalleryProps) {
  const [selectedPiece, setSelectedPiece] = useState<PortfolioPiece | null>(null);
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
                  setSelectedPiece(piece);
                  setIsOpen(true);
                }}
                aria-label={`Enlarge ${piece.style} tattoo by ${piece.artist.name}`}
                className="group block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <img
                  src={piece.imgUrl}
                  alt={`${piece.style} tattoo by ${piece.artist.name}`}
                  loading="lazy"
                  className="h-full w-full object-contain saturate-[0.65] contrast-[1.08]transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-100 group-focus-visible:saturate-100
"
                />
              </button>

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
                src={selectedPiece.imgUrl}
                alt={`${selectedPiece.style} tattoo by ${selectedPiece.artist.name}`}
                className="max-h-[80vh] w-full sm:w-auto object-contain"
              />

              <DialogClose
                aria-label="Close"
                className="absolute top-5 right-5 inline-flex size-9 items-center justify-center border border-border bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
              >
                <X className="size-4" aria-hidden="true" />
              </DialogClose>

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
