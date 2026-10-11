import { NavLink } from "react-router";

type SiteNavigationProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Artists", to: "/artists" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
];

export function SiteNavigation({ orientation = "horizontal", onNavigate }: SiteNavigationProps) {
  const listClasses =
    orientation === "horizontal" ? "flex items-center gap-8" : "flex flex-col gap-6";

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
                  "text-sm font-medium uppercase tracking-widest transition-colors",
                  "hover:text-[#ddbd7b]",
                  isActive ? "text-[#ddbd7b]" : "text-[#f2ede4]/80",
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
