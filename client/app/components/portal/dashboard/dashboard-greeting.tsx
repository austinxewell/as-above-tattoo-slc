import { BrandSeal } from "~/components/shared/brand-seal";

type DashboardGreetingProps = {
  name: string;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function localDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  const now = new Date();

  return (
    <header>
      <div className="flex items-center gap-5">
        <BrandSeal className="size-26 md:size-36" />

        <div className="min-w-0">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            <time dateTime={localDate(now)}>{dateFormat.format(now)}</time>
          </p>

          <h1 className="mt-1 font-display text-3xl uppercase leading-none text-balance md:text-5xl">
            {greetingFor(now.getHours())}, {name}
          </h1>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-7 flex items-center gap-4 text-xl md:text-2xl text-accent before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border"
      >
        ✦
      </div>
    </header>
  );
}
