import { Form, Link, useSearchParams } from "react-router";
import { useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

type PortfolioFiltersProps = {
  artists: { slug: string; name: string }[];
  styles: string[];
};

const chipClasses = "border px-4 py-2 text-[0.65rem] uppercase tracking-[0.15em] transition-colors";
const activeClasses = "border-accent bg-accent text-accent-foreground";
const inactiveClasses = "border-border hover:border-accent";

export function PortfolioFilters({ artists, styles }: PortfolioFiltersProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const artistParam = searchParams.get("artist");
  const styleParam = searchParams.get("style");

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeFilterCount = [artistParam, styleParam].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || query !== "";

  // Builds a link that changes one filter and keeps the others.
  function filterHref(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    return `?${next}`;
  }

  function renderGroup(label: string, key: string, options: { value: string; label: string }[]) {
    const current = searchParams.get(key)?.toLowerCase() ?? null;

    return (
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {[{ value: "", label: "All" }, ...options].map((option) => {
          const isActive = (current ?? "") === option.value.toLowerCase();

          return (
            <Link
              key={option.label}
              to={filterHref(key, option.value || null)}
              preventScrollReset
              aria-current={isActive ? "true" : undefined}
              className={`${chipClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    );
  }

  const chipGroups = (
    <>
      {renderGroup(
        "Filter by artist",
        "artist",
        artists.map((artist) => ({ value: artist.slug, label: artist.name })),
      )}
      {renderGroup(
        "Filter by style",
        "style",
        styles.map((style) => ({ value: style, label: style })),
      )}
    </>
  );

  return (
    <div className="mt-12 flex flex-col gap-4">
      <Form
        method="get"
        preventScrollReset
        role="search"
        className="flex max-w-md border border-border transition-colors focus-within:border-accent"
      >
        {artistParam && <input type="hidden" name="artist" value={artistParam} />}
        {styleParam && <input type="hidden" name="style" value={styleParam} />}

        <label htmlFor="portfolio-search" className="sr-only">
          Search the portfolio
        </label>
        <input
          key={query}
          id="portfolio-search"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by keyword, style or artist"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <Link
            to={filterHref("q", null)}
            preventScrollReset
            aria-label="Clear search"
            className="flex items-center px-2 text-accent"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
        <button type="submit" aria-label="Search" className="px-4 text-accent">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </Form>

      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger className="inline-flex items-center gap-2 self-start border border-border px-4 py-2 text-[0.65rem] uppercase tracking-[0.15em] lg:hidden">
          <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" />
          Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </SheetTrigger>

        <SheetContent side="bottom" className="bg-background">
          <SheetHeader>
            <SheetTitle>Filter the portfolio</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4 pb-4">{chipGroups}</div>

          <div className="border-t border-border p-4">
            <Button
              variant="brand"
              size="cta"
              className="w-full"
              onClick={() => setIsFiltersOpen(false)}
            >
              Show results
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden flex-col gap-4 lg:flex">{chipGroups}</div>

      {hasActiveFilters && (
        <Link
          to="/portfolio"
          preventScrollReset
          className="self-start border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
        >
          Clear all filters
        </Link>
      )}
    </div>
  );
}
