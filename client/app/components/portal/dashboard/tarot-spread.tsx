import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { DashboardStat } from "~/lib/dashboard";
import { BrandSeal } from "~/components/shared/brand-seal";

const numerals = ["I", "II", "III", "IV", "V", "VI"];

const frameClasses =
  "relative border border-accent bg-surface bg-[image:radial-gradient(120%_70%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_70%)] outline outline-1 outline-offset-[-7px] outline-accent/50";

const cardClasses =
  "flex items-center justify-between gap-4 px-5 py-4 md:min-h-64 md:flex-col md:px-4 md:py-5 md:text-center";

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute hidden text-[0.55rem] text-accent/80 md:block", className)}
    >
      ✦
    </span>
  );
}

function TarotCard({ stat, numeral }: { stat: DashboardStat; numeral: string }) {
  const { label, value, unit, hint, to } = stat;
  const isEmpty = value === null || value === 0;

  const content = (
    <>
      <Corner className="top-3 left-3" />
      <Corner className="top-3 right-3" />
      <Corner className="bottom-3 left-3" />
      <Corner className="right-3 bottom-3" />

      <span
        aria-hidden="true"
        className="mt-1 hidden border border-accent/60 px-3.5 font-display text-accent md:inline-block"
      >
        {numeral}
      </span>

      <span
        className={cn(
          "shrink-0 font-display text-5xl leading-[0.9] tabular-nums md:text-7xl",
          isEmpty ? "text-muted-foreground/60" : "text-accent",
        )}
      >
        {value ?? "—"}
        {unit && value !== null && (
          <span className="ml-2 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground md:mt-2 md:ml-0 md:block">
            {unit}
          </span>
        )}
      </span>

      <span className="order-first min-w-0 md:order-none md:mb-1 md:w-full md:border-y md:border-accent/60 md:px-1 md:py-2">
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.22em]">
          {label}
        </span>
        {hint && <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </>
  );

  if (!to) {
    return <div className={cn(frameClasses, cardClasses)}>{content}</div>;
  }

  return (
    <Link
      to={to}
      className={cn(
        frameClasses,
        cardClasses,
        "hover:shadow-[0_18px_30px_-18px_rgb(0_0_0/0.45)] motion-safe:transition motion-safe:duration-300 md:hover:-translate-y-1",
      )}
    >
      {content}
    </Link>
  );
}

type TarotSpreadProps = {
  stats: DashboardStat[];
  label: string;
  className?: string;
};

export function TarotSpread({ stats, label, className }: TarotSpreadProps) {
  const allClear = stats.every((stat) => stat.value === null || stat.value === 0);

  if (allClear) {
    return (
      <section
        aria-label={label}
        className={cn(
          frameClasses,
          "flex flex-col items-center gap-5 px-6 py-10 text-center md:flex-row md:gap-8 md:px-10 md:text-left",
          className,
        )}
      >
        <BrandSeal className="size-20 md:size-24" />
        <div>
          <p className="font-display text-3xl uppercase md:text-4xl">All caught up</p>
          <p className="mt-2 text-muted-foreground">
            Nothing needs you right now. New requests will show up here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={label} className={cn("grid gap-3 md:grid-cols-3 md:gap-5", className)}>
      {stats.map((stat, index) => (
        <TarotCard key={stat.label} stat={stat} numeral={numerals[index] ?? ""} />
      ))}
    </section>
  );
}
