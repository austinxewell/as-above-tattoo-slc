import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { sizedImage } from "~/lib/image-url";
import { SectionHeading } from "./section-heading";

type ArtistsPreviewProps = {
  artists: { id: string; name: string; slug: string; specialties: string[]; imgUrl: string }[];
};

export function ArtistsPreview({ artists }: ArtistsPreviewProps) {
  return (
    <section className="px-6 py-24 md:px-[6.2vw] md:py-32" aria-labelledby="artists-preview-title">
      <SectionHeading
        id="artists-preview-title"
        index="04"
        eyebrow="The artists"
        title="Meet the hands behind the work"
        description="Each artist brings their own style and specialty. Find the one whose work speaks to you."
      />

      <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <li key={artist.id}>
            <Link
              to={`/artists/${artist.slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <div className="overflow-hidden border border-border">
                <img
                  src={sizedImage(artist.imgUrl, 800)}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover saturate-[0.65] contrast-[1.08] transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-100"
                />
              </div>
              <h3 className="mt-5 font-display text-2xl">{artist.name}</h3>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.17em] text-muted-foreground">
                {artist.specialties.join(" · ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/artists"
        className="mt-14 inline-flex items-center gap-3 border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
      >
        Meet all the artists
        <ArrowRight size={14} strokeWidth={1.5} />
      </Link>
    </section>
  );
}
