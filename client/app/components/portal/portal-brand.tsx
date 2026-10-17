import { Link } from "react-router";

export function PortalBrand() {
  return (
    <Link
      to="/portal"
      aria-label="As Above Tattoo staff portal"
      className="flex items-center gap-3"
    >
      <img
        src="/images/logos/stacked-shop-name-transparent.png"
        alt=""
        className="h-12 w-auto object-contain"
      />
      <span className="border-l border-border pl-3 text-[0.65rem] uppercase tracking-[0.3em] text-accent">
        Portal
      </span>
    </Link>
  );
}
