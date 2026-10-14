import { Link } from "react-router";
import { ArtistInfo } from "./artist-info";

export type Artist = {
  id: string;
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  imgUrl: string;
  instagram: string | null;
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

            <ArtistInfo artist={artist} />
          </div>
        </li>
      ))}
    </ul>
  );
}
