import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export function PublicPageLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      target="_blank"
      rel="noreferrer"
      className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
    >
      {label}
      <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </Link>
  );
}
