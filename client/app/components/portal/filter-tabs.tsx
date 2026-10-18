import { Link, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";

export type FilterOption = { value: string; label: string; count: number };

type FilterTabsProps = {
  param: string;
  label: string;
  options: FilterOption[];
};

export function FilterTabs({ param, label, options }: FilterTabsProps) {
  const [searchParams] = useSearchParams();
  const current = searchParams.get(param) ?? "all";

  function linkFor(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete(param);
    else next.set(param, value);
    const query = next.toString();
    return query ? `?${query}` : ".";
  }

  return (
    <nav
      aria-label={label}
      className="flex gap-x-6 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map(({ value, label: optionLabel, count }) => {
        const isActive = value === current;

        return (
          <Link
            key={value}
            to={linkFor(value)}
            preventScrollReset
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {optionLabel}
            <span className="ml-2 text-muted-foreground">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
