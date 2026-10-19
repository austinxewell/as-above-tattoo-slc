import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { PublicLink } from "~/lib/dashboard";

export function PublicLinks({ links }: { links: PublicLink[] }) {
  return (
    <ul className="grid gap-1">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            target="_blank"
            rel="noopener"
            className="group flex items-center gap-3 py-1.5 text-sm"
          >
            <span className="dark size-10 shrink-0 overflow-hidden rounded-full bg-background">
              <img src={link.badge} alt="" width={40} height={40} className="size-full scale-160" />
            </span>
            <span className="border-b border-transparent transition-colors group-hover:border-accent">
              {link.label}
            </span>
            <ArrowUpRight
              className="size-3.5 text-muted-foreground transition-colors group-hover:text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
