import { cn } from "~/lib/utils";
import type { ArtistBookingState } from "~/lib/dashboard";

export function ArtistBooks({ artists }: { artists: ArtistBookingState[] }) {
  if (artists.length === 0) {
    return <p className="text-sm text-muted-foreground">No artists yet.</p>;
  }

  return (
    <ul className="grid gap-2.5">
      {artists.map((artist) => (
        <li key={artist.slug} className="flex items-center justify-between gap-3">
          <span className="truncate">{artist.name}</span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.18em]",
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
        </li>
      ))}
    </ul>
  );
}
