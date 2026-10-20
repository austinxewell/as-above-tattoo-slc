import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { ArtistProfile } from "~/lib/artist-profile";
import { ArtistPhoto } from "~/components/shared/artist-photo";

export function ProfilePreview({ artist }: { artist: ArtistProfile }) {
  return (
    <aside
      aria-label="Preview"
      className="self-start border border-border bg-surface xl:sticky xl:top-6"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          Preview
        </span>
        <Link
          to={`/artists/${artist.slug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.2em] text-accent"
        >
          Open page
          <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
      </div>

      <div className="p-4">
        <ArtistPhoto
          src={artist.imgUrl}
          alt=""
          className="aspect-[4/5] w-full border border-border"
        />

        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-accent">Artist profile</p>
        <p className="mt-2 font-display text-2xl uppercase leading-none">{artist.name}</p>
        <p className="mt-3 font-display italic leading-snug text-muted-foreground">
          &ldquo;{artist.statement}&rdquo;
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {artist.booking.minimum} minimum · {artist.booking.rate}
        </p>
      </div>
    </aside>
  );
}
