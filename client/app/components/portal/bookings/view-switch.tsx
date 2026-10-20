import { Link, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";

type ViewSwitchProps = {
  counts: { active: number; archived: number };
};

export function ViewSwitch({ counts }: ViewSwitchProps) {
  const [searchParams] = useSearchParams();
  const isArchived = searchParams.get("view") === "archived";

  function linkFor(archived: boolean) {
    const next = new URLSearchParams(searchParams);
    next.delete("page");

    if (archived) next.set("view", "archived");
    else next.delete("view");
    const query = next.toString();
    return query ? `?${query}` : ".";
  }

  const options = [
    { label: "Active", count: counts.active, archived: false },
    { label: "Archived", count: counts.archived, archived: true },
  ];

  return (
    <nav aria-label="Booking view" className="grid shrink-0 grid-cols-2 border border-border">
      {options.map((option) => {
        const isActive = option.archived === isArchived;

        return (
          <Link
            key={option.label}
            to={linkFor(option.archived)}
            preventScrollReset
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "px-4 py-1.5 text-center text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-accent",
            )}
          >
            {option.label}
            <span
              className={cn(
                "ml-2",
                isActive ? "text-accent-foreground/70" : "text-muted-foreground",
              )}
            >
              {option.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
