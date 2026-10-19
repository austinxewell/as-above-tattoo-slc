import { useId, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type DashboardSectionProps = {
  title: string;
  action?: { label: string; to: string };
  className?: string;
  children: ReactNode;
};

export function DashboardSection({ title, action, className, children }: DashboardSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="flex items-center justify-between gap-4">
        <h2
          id={headingId}
          className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-accent"
        >
          <span aria-hidden="true" className="text-[0.7rem]">
            ✦
          </span>
          {title}
        </h2>

        {action && (
          <Link
            to={action.to}
            className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
          >
            {action.label}
            <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}
