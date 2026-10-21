import { Star } from "lucide-react";

export function FeaturedLegend({ canFeature }: { canFeature: boolean }) {
  return (
    <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border py-3 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center bg-accent text-accent-foreground"
        >
          <Star className="size-3.5" fill="currentColor" strokeWidth={1.5} />
        </span>
        {canFeature ? "Featured on the home page" : "Featured on the home page by the shop"}
      </span>

      {canFeature && (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="grid size-6 place-items-center border border-border">
            <Star className="size-3.5" strokeWidth={1.5} />
          </span>
          Click a star to add or remove it
        </span>
      )}
    </p>
  );
}
