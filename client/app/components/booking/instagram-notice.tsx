import { FaInstagram } from "react-icons/fa";

type InstagramNoticeProps = {
  artists: { slug: string; name: string; isBooking: boolean; instagram: string | null }[];
};

export function InstagramNotice({ artists }: InstagramNoticeProps) {
  return (
    <div className="border border-accent/40 bg-background p-6">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        Online requests coming soon
      </p>
      <p className="mt-3 leading-7">
        We're not taking requests through the site just yet. For now, message your artist directly
        on Instagram:
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {artists
          .filter((artist) => artist.instagram)
          .map((artist) => (
            <li key={artist.slug}>
              <a
                href={`https://www.instagram.com/${artist.instagram}/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent"
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
    </div>
  );
}
