import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { statusLabels, type BookingStatus } from "~/lib/bookings";
import type { PipelineStage } from "~/lib/dashboard";

const segmentColors: Record<BookingStatus, string> = {
  new: "bg-accent",
  contacted: "bg-muted-foreground/50",
  scheduled: "bg-success",
  declined: "bg-destructive/75",
};

type PipelineBarProps = {
  stages: PipelineStage[];
  basePath: string;
};

export function PipelineBar({ stages, basePath }: PipelineBarProps) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);
  const summary = stages
    .map((stage) => `${stage.count} ${statusLabels[stage.status].toLowerCase()}`)
    .join(", ");

  return (
    <div>
      {total > 0 ? (
        <div role="img" aria-label={summary} className="flex h-3.5 gap-[3px]">
          {stages
            .filter((stage) => stage.count > 0)
            .map((stage) => (
              <span
                key={stage.status}
                className={cn("basis-0", segmentColors[stage.status])}
                style={{ flexGrow: stage.count }}
              />
            ))}
        </div>
      ) : (
        <div aria-hidden="true" className="h-3.5 bg-surface-raised" />
      )}

      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {stages.map((stage) => (
          <li key={stage.status}>
            <Link
              to={`${basePath}?status=${stage.status}`}
              className="inline-flex items-baseline gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              <span
                aria-hidden="true"
                className={cn("size-2 self-center", segmentColors[stage.status])}
              />
              {statusLabels[stage.status]}
              <span className="font-display text-2xl tracking-normal text-foreground tabular-nums">
                {stage.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
