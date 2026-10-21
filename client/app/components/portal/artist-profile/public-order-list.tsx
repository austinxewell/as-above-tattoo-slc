import { useFetcher } from "react-router";
import { ArrowDown, ArrowUp } from "lucide-react";

type OrderedArtist = { slug: string; name: string };

const buttonClasses =
  "grid size-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

export function PublicOrderList({ artists }: { artists: OrderedArtist[] }) {
  if (artists.length === 0) return null;

  return (
    <section aria-labelledby="order-heading" className="mt-10">
      <h2 id="order-heading" className="font-display text-xl uppercase">
        Order on the site
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The order published artists appear in on the Artists page and the booking form.
      </p>

      <ol className="mt-4 max-w-xl divide-y divide-border border border-border bg-surface">
        {artists.map((artist, index) => (
          <OrderRow
            key={artist.slug}
            artist={artist}
            position={index + 1}
            isFirst={index === 0}
            isLast={index === artists.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}

type OrderRowProps = {
  artist: OrderedArtist;
  position: number;
  isFirst: boolean;
  isLast: boolean;
};

function OrderRow({ artist, position, isFirst, isLast }: OrderRowProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const isMoving = fetcher.state !== "idle";
  const error = fetcher.state === "idle" ? fetcher.data?.error : null;

  return (
    <li className="px-4 py-2.5">
      <div className="flex items-center gap-4">
        <span className="w-6 font-display text-lg text-accent tabular-nums">{position}</span>
        <span className="min-w-0 flex-1 truncate">{artist.name}</span>

        <fetcher.Form method="post" className="flex gap-1.5">
          <input type="hidden" name="slug" value={artist.slug} />
          <button
            type="submit"
            name="direction"
            value="up"
            disabled={isFirst || isMoving}
            aria-label={`Move ${artist.name} up`}
            className={buttonClasses}
          >
            <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="submit"
            name="direction"
            value="down"
            disabled={isLast || isMoving}
            aria-label={`Move ${artist.name} down`}
            className={buttonClasses}
          >
            <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </fetcher.Form>
      </div>

      {error && (
        <p role="alert" className="mt-1 pl-10 text-sm text-destructive">
          {error}
        </p>
      )}
    </li>
  );
}
