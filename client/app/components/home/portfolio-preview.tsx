import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FadeInImage } from "../shared/fade-in-image";
import { PieceLightbox } from "~/components/portfolio/piece-lightbox";
import { sizedImage } from "~/lib/image-url";

type FeaturedPiece = { id: string; style: string; imgUrl: string; artist: { name: string } };

type PortfolioPreviewProps = {
  portfolio: FeaturedPiece[];
};

export function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  const [selectedPiece, setSelectedPiece] = useState<FeaturedPiece | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

  return (
    <section
      id="portfolio"
      className="scroll-mt-20 px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="portfolio-preview-title"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="portfolio-preview-title"
          index="02"
          eyebrow="Selected work"
          title="The portfolio"
          description="Featured pieces from across the studio's styles. Every tattoo is drawn custom for the person wearing it."
        />

        <Link
          to="/portfolio"
          className="inline-flex items-center gap-3 self-start border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em] md:self-auto"
        >
          View full portfolio
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {portfolio.map((piece) => (
          <li key={piece.id}>
            <figure>
              <button
                type="button"
                onClick={(event) => {
                  const tile = event.currentTarget.querySelector("img");
                  setSelectedRatio(
                    tile?.naturalWidth ? tile.naturalWidth / tile.naturalHeight : null,
                  );
                  setSelectedPiece(piece);
                  setIsOpen(true);
                }}
                aria-label={`Enlarge ${piece.style} tattoo by ${piece.artist.name}`}
                className="relative block w-full cursor-zoom-in overflow-hidden border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <FadeInImage
                  src={sizedImage(piece.imgUrl, 800)}
                  alt={`${piece.style} tattoo by ${piece.artist.name}`}
                  className="aspect-[4/5] w-full object-cover saturate-[0.65] contrast-[1.08]"
                />
              </button>

              <figcaption className="mt-3 flex justify-between gap-2 text-[0.65rem] uppercase tracking-[0.15em]">
                <span>{piece.style}</span>
                <span className="text-muted-foreground">{piece.artist.name}</span>
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
    </section>
  );
}
