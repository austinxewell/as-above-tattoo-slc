type HealingTimelineProps = {
  stages: {
    id: number;
    timeframe: string;
    title: string;
    steps: string[];
  }[];
};

export function HealingTimeline({ stages }: HealingTimelineProps) {
  return (
    <ol className="mt-12 ml-4 flex flex-col gap-14 border-l border-accent/30">
      {stages.map((stage, index) => (
        <li key={stage.id} className="relative pl-10">
          <span
            className="absolute top-0 -left-4 flex size-8 items-center justify-center rounded-full border border-accent bg-background font-display text-sm text-accent"
            aria-hidden="true"
          >
            {index + 1}
          </span>

          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">{stage.timeframe}</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">{stage.title}</h2>

          <ul className="mt-5 flex max-w-2xl flex-col gap-3">
            {stage.steps.map((step) => (
              <li key={step} className="flex gap-3 leading-7 text-muted-foreground">
                <span className="text-accent" aria-hidden="true">
                  &mdash;
                </span>
                {step}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
