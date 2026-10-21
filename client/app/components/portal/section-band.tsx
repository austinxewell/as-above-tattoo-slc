import type { ReactNode } from "react";

type SectionBandProps = {
  id: string;
  step?: number;
  title: string;
  hint: string;
  children: ReactNode;
};

export function SectionBand({ id, step, title, hint, children }: SectionBandProps) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-5 border-t border-border py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
    >
      <div className="flex items-baseline gap-4">
        {step && <span className="font-display text-2xl text-accent tabular-nums">{step}</span>}
        <div>
          <h2 id={id} className="font-display text-xl uppercase">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>

      <div className="min-w-0">{children}</div>
    </section>
  );
}
