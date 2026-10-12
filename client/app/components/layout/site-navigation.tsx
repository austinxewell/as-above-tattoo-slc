import { NavLink } from "react-router";

type SiteNavigationProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Artists", to: "/artists" },
  { label: "After Care", to: "/after-care" },
  { label: "Pricing", to: "/pricing" },
  { label: "Shop", to: "/shop" },
];

export function SiteNavigation({ orientation = "horizontal", onNavigate }: SiteNavigationProps) {
  const listClasses =
    orientation === "horizontal" ? "flex items-center gap-4 2xl:gap-6" : "flex flex-col gap-6";

  return (
    <nav aria-label="Main navigation">
      <ul className={listClasses}>
        {navigationItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "text-sm font-medium uppercase whitespace-nowrap tracking-widest transition-colors",
                  "hover:text-accent-hover",
                  isActive ? "text-accent-hover" : "text-foreground/80",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
