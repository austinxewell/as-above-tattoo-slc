import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { facebookUrl, formatPhone, instagramUrl, type ShopDetails } from "~/lib/shop";

const linkClasses =
  "inline-flex items-center gap-2 border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent";

type InstagramNoticeProps = {
  artists: { slug: string; name: string; isBooking: boolean; instagram: string | null }[];
  shop?: ShopDetails | null;
};

export function InstagramNotice({ artists, shop }: InstagramNoticeProps) {
  const reachableArtists = artists.filter((artist) => artist.instagram);
  const hasArtists = reachableArtists.length > 0;

  return (
    <div className="border border-accent/40 bg-background p-6">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        Online requests coming soon
      </p>
      <p className="mt-3 leading-7">
        We're not taking requests through the site just yet.{" "}
        {hasArtists
          ? "For now, message your artist directly on Instagram:"
          : shop
            ? "For now, contact the shop directly:"
            : "Please check back soon."}
      </p>

      {hasArtists && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {reachableArtists.map((artist) => (
            <li key={artist.slug}>
              <a
                href={instagramUrl(artist.instagram ?? "")}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <FaInstagram className="size-4" aria-hidden="true" />
                {artist.name} · @{artist.instagram}
                {!artist.isBooking && (
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Books closed
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      {shop && (
        <div className={hasArtists ? "mt-6 border-t border-border pt-5" : "mt-4"}>
          {hasArtists && (
            <p className="text-sm text-muted-foreground">Not sure who to ask? Contact the shop:</p>
          )}

          <ul className={`flex flex-wrap gap-x-6 gap-y-3 ${hasArtists ? "mt-3" : ""}`}>
            <li>
              <a href={`tel:${shop.phone}`} className={linkClasses}>
                <Phone className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {formatPhone(shop.phone)}
              </a>
            </li>
            <li>
              <a
                href={instagramUrl(shop.instagram)}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <FaInstagram className="size-4" aria-hidden="true" />@{shop.instagram}
              </a>
            </li>
            <li>
              <a
                href={facebookUrl(shop.facebook)}
                target="_blank"
                rel="noreferrer"
                className={linkClasses}
              >
                <FaFacebook className="size-4" aria-hidden="true" />
                Facebook
              </a>
            </li>
            {shop.email && (
              <li>
                <a href={`mailto:${shop.email}`} className={linkClasses}>
                  <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  {shop.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
