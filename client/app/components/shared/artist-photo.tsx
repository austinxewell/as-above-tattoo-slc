import { useState } from "react";
import { cn } from "~/lib/utils";

type ArtistPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  compact?: boolean;
};

export function ArtistPhoto({ src, alt, className, compact = false }: ArtistPhotoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isMissing = !src;
  const hasFailed = Boolean(src) && failedSrc === src;

  if (isMissing || hasFailed) {
    return (
      <div
        className={cn(
          "@container relative grid place-items-center overflow-hidden bg-black",
          className,
        )}
      >
        <img
          src="/images/logos/tarot-card.webp"
          alt=""
          className="h-full w-full object-contain opacity-40"
        />
        <span
          className={cn(
            "absolute max-w-[90%] border border-destructive bg-background/90 text-center uppercase leading-snug text-destructive",
            compact
              ? "sr-only"
              : "px-1.5 py-1 text-[0.5rem] tracking-[0.06em] @min-[10rem]:px-3 @min-[10rem]:py-1.5 @min-[10rem]:text-[0.6rem] @min-[10rem]:tracking-[0.2em]",
          )}
        >
          {isMissing ? "No profile picture" : "Photo unavailable"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className={cn("object-cover saturate-[0.65] contrast-[1.08]", className)}
    />
  );
}
