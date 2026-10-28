import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { DialogCloseButton } from "~/components/shared/dialog-close-button";
import { sizedImage } from "~/lib/image-url";

export type LightboxPiece = {
  imgUrl: string;
  style: string;
  artist: { name: string };
};

type PieceLightboxProps = {
  piece: LightboxPiece | null;
  ratio: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PieceLightbox({ piece, ratio, open, onOpenChange }: PieceLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full sm:w-auto max-w-[calc(100%-2rem)] gap-3 rounded-none border border-border bg-background p-3 sm:max-w-[calc(100%-2rem)]"
      >
        {piece && (
          <>
            <DialogTitle className="sr-only">
              {piece.style} tattoo by {piece.artist.name}
            </DialogTitle>

            <img
              src={sizedImage(piece.imgUrl, 1600)}
              alt={`${piece.style} tattoo by ${piece.artist.name}`}
              style={ratio ? { aspectRatio: ratio } : undefined}
              className="max-h-[80vh] w-full object-contain sm:h-[80vh] sm:max-h-none sm:w-auto sm:max-w-[calc(100vw-4rem)]"
            />
            <DialogCloseButton />

            <p className="flex justify-between gap-4 text-[0.65rem] uppercase tracking-[0.15em]">
              <span>{piece.style}</span>
              <span className="text-muted-foreground">{piece.artist.name}</span>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
