import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { ArtistSummary } from "~/lib/artist-profile";
import { ArtistPhoto } from "~/components/shared/artist-photo";
import { StatusDot } from "~/components/portal/status-dot";

export type ArtistLogin = "active" | "pending" | null;

type ArtistCardProps = {
  artist: ArtistSummary;
  login: ArtistLogin;
};

export function ArtistCard({ artist, login }: ArtistCardProps) {
  return (
    <Link
      to={`/portal/admin/artists/${artist.slug}`}
      className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border border-border bg-surface p-4 transition-colors hover:border-accent"
    >
      <ArtistPhoto
        src={artist.imgUrl}
        alt=""
        className="aspect-[4/5] w-full border border-border"
      />

      <div className="flex min-w-0 flex-col">
        <p className="font-display text-xl uppercase leading-none">{artist.name}</p>
        <p className="mt-2 truncate text-sm text-muted-foreground">
          {artist.specialties.join(" · ") || "No specialties yet"}
        </p>

        <div className="mt-3 grid gap-1">
          <StatusDot tone={artist.isPublished ? "success" : "muted"}>
            {artist.isPublished ? "Published" : "Draft"}
          </StatusDot>
          <StatusDot tone={artist.isBooking ? "success" : "muted"}>
            {artist.isBooking ? "Books open" : "Books closed"}
          </StatusDot>
          <StatusDot
            tone={login === "active" ? "success" : login === "pending" ? "accent" : "muted"}
          >
            {login === "active"
              ? "Login active"
              : login === "pending"
                ? "Invite pending"
                : "No login"}
          </StatusDot>
        </div>

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
