import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type StaffBarProps = {
  name: string;
};

export function StaffBar({ name }: StaffBarProps) {
  return (
    <aside
      aria-label="Staff"
      className="dark border-b border-border bg-surface-raised text-foreground print:hidden"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-2 text-[0.65rem] uppercase tracking-[0.2em] lg:px-8 2xl:px-12">
        <p className="min-w-0 truncate text-muted-foreground">
          <span className="text-accent">Staff</span>
          <span className="hidden sm:inline"> · Signed in as {name}</span>
        </p>

        <Link
          to="/portal"
          className="inline-flex shrink-0 items-center gap-2 text-foreground transition-colors hover:text-accent-hover"
        >
          Go to portal
          <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
