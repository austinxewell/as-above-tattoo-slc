import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type Artist = {
  id: number;
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  imgUrl: string;
  instagram: string;
  isBooking: boolean;
};

type ArtistListProps = {
  artists: Artist[];
};

export function ArtistList({ artists }: ArtistListProps) {
  return (
    <ul className="mt-20 divide-y divide-accent/30">
      {artists.map((artist, index) => (
        <li
          key={artist.id}
          className="grid items-center gap-8 md:grid-cols-2 md:gap-16 py-16 first:pt-0 last:pb-0 md:py-24"
        >
          <Link
            to={`/artists/${artist.slug}`}
            className={`group block overflow-hidden border border-border ${index % 2 === 1 ? "md:order-2" : ""}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={artist.imgUrl}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover saturate-[0.65] contrast-[1.08] transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-100"
            />
          </Link>

          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.36em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>

            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">
              <Link to={`/artists/${artist.slug}`}>{artist.name}</Link>
            </h2>

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
                    to={`/portfolio?artist=${artist.slug}`}
                    className="border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
                  >
                    View work
                  </Link>
                </>
              ) : (
                <Link
                  to={`/portfolio?artist=${artist.slug}`}
                  className={cn(buttonVariants({ variant: "brand", size: "cta" }))}
                >
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
          </div>
        </li>
      ))}
    </ul>
  );
}
