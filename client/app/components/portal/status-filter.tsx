import { Link, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import { bookingStatuses, isBookingStatus, statusLabels, type countByStatus } from "~/lib/bookings";

type StatusFilterProps = {
  counts: ReturnType<typeof countByStatus>;
};

const options = [
  { value: "all", label: "All" },
  ...bookingStatuses.map((status) => ({ value: status, label: statusLabels[status] })),
] as const;

export function StatusFilter({ counts }: StatusFilterProps) {
  const [searchParams] = useSearchParams();
  const param = searchParams.get("status");
  const current = isBookingStatus(param) ? param : "all";

  return (
    <nav
      aria-label="Filter by status"
      className="mt-10 flex gap-x-6 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map(({ value, label }) => {
        const isActive = value === current;

        return (
          <Link
            key={value}
            to={value === "all" ? "." : `?status=${value}`}
            preventScrollReset
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            <span className="ml-2 text-muted-foreground">{counts[value]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
