import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Artist } from "./artist-list";

type ArtistInfoProps = {
  artist: Artist;
  workHref?: string;
};

export function ArtistInfo({
  artist,
  workHref = `/portfolio?artist=${artist.slug}`,
}: ArtistInfoProps) {
  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2">
        {artist.specialties.map((specialty) => (
          <li
            key={specialty}
            className="border border-border px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground"
          >
            {specialty}
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-md leading-7 text-muted-foreground">{artist.bio}</p>

      <p className="mt-6 flex items-center gap-3 text-[0.65rem] leading-none uppercase tracking-[0.2em]">
        <span
          className={`size-2 rounded-full -translate-y-px ${artist.isBooking ? "bg-accent" : "bg-muted-foreground/40"}`}
          aria-hidden="true"
        />
        {artist.isBooking ? "Books open" : "Books closed"}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        {artist.isBooking ? (
          <>
            <Link
              to={`/booking?artist=${artist.slug}`}
              className={cn(buttonVariants({ variant: "brand", size: "cta" }))}
            >
              Book with {artist.name.split(" ")[0]}
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>

            <Link
              to={workHref}
              className="border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
            >
              View work
            </Link>
          </>
        ) : (
          <Link to={workHref} className={cn(buttonVariants({ variant: "brand", size: "cta" }))}>
            View work
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        )}

        <a
          href={`https://www.instagram.com/${artist.instagram}/`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-accent"
        >
          <FaInstagram className="size-4" aria-hidden="true" />@{artist.instagram}
        </a>
      </div>
    </>
  );
}
