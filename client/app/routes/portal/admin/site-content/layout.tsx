import { NavLink, Outlet } from "react-router";
import { cn } from "~/lib/utils";
import { siteContentTabs } from "~/components/portal/site-content/tabs";

export default function SiteContentLayout() {
  return (
    <section>
      <h1 className="font-display text-3xl uppercase">Site content</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Shop-wide settings and page text for the public site. Changes take effect right away.
      </p>

      <nav
        aria-label="Site content sections"
        className="mt-8 flex gap-6 overflow-x-auto border-b border-border [scrollbar-width:none]"
      >
        {siteContentTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                "-mb-px shrink-0 border-b-2 pb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-colors",
                isActive
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </section>
  );
}
