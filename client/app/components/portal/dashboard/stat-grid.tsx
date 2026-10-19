import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { DashboardStat } from "~/lib/dashboard";

const cellClasses = "flex flex-col bg-background p-5";

function StatCard({ label, value, unit, to, hint, icon: Icon }: DashboardStat) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        {Icon && (
          <Icon
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </div>

      <p className="mt-4 font-display text-4xl leading-none tabular-nums">
        {value ?? "—"}
        {unit && value !== null && (
          <span className="ml-2 text-base uppercase tracking-[0.15em] text-muted-foreground">
            {unit}
          </span>
        )}
      </p>

      {hint && <p className="mt-3 text-sm text-muted-foreground">{hint}</p>}
    </>
  );

  if (!to) {
    return <div className={cellClasses}>{content}</div>;
  }

  return (
    <Link to={to} className={cn(cellClasses, "group transition-colors hover:bg-surface-raised")}>
      {content}
      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        View
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function StatGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-px border border-border bg-border">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
