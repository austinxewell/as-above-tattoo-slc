import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ArtistSummary } from "~/lib/artist-profile";

export function ArtistCard({ artist }: { artist: ArtistSummary }) {
  return (
    <Link
      to={`/portal/admin/artists/${artist.slug}`}
      className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border border-border bg-surface p-4 transition-colors hover:border-accent"
    >
      <img
        src={artist.imgUrl}
        alt=""
        className="aspect-[4/5] w-full border border-border object-cover saturate-[0.65] contrast-[1.08]"
      />

      <div className="flex min-w-0 flex-col">
        <p className="font-display text-xl uppercase leading-none">{artist.name}</p>
        <p className="mt-2 truncate text-sm text-muted-foreground">
          {artist.specialties.join(" · ") || "No specialties yet"}
        </p>

        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.18em]",
            artist.isBooking ? "text-success" : "text-muted-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full border",
              artist.isBooking ? "border-success bg-success" : "border-muted-foreground",
            )}
          />
          {artist.isBooking ? "Books open" : "Books closed"}
        </span>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[0.6rem] uppercase tracking-[0.2em] text-accent">
          Edit profile
          <ArrowRight
            className="size-3 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
