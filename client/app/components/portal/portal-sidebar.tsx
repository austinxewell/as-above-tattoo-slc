import { useState } from "react";
import { Form, Link, NavLink, useLocation } from "react-router";
import { ArrowLeft, Flag, LogOut } from "lucide-react";
import { cn } from "~/lib/utils";
import { canUseAdmin, canUseArtist, type CurrentUser } from "~/lib/current-user";
import { adminNav, artistNav } from "~/lib/portal-nav";
import { PortalBrand } from "./portal-brand";
import { AppearanceSection } from "../shared/appearance-section";
import { ReportIssueDialog } from "./report-issue-dialog";

type PortalSidebarProps = {
  user: CurrentUser;
  onNavigate?: () => void;
};

const toggleClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex-1 py-1.5 text-center text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-accent",
  );

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium uppercase tracking-widest transition-colors hover:text-accent-hover",
    isActive ? "text-accent-hover" : "text-foreground/80",
  );

export function PortalSidebar({ user, onNavigate }: PortalSidebarProps) {
  const { pathname } = useLocation();
  const dashboard = pathname.startsWith("/portal/artist")
    ? "artist"
    : pathname.startsWith("/portal/admin")
      ? "admin"
      : null;
  const items = dashboard === "artist" ? artistNav : dashboard === "admin" ? adminNav : [];
  const canSwitch = canUseAdmin(user) && canUseArtist(user);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-8 py-6">
      <div className="px-4">
        <PortalBrand />
      </div>

      <div className="px-4">
        <p className="font-medium">{user.name}</p>
        {dashboard && (
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-accent">{dashboard}</p>
        )}

        {canSwitch && (
          <nav aria-label="Dashboard" className="mt-4 flex border border-border">
            <NavLink to="/portal/admin" className={toggleClasses}>
              Admin
            </NavLink>
            <NavLink to="/portal/artist" className={toggleClasses}>
              Artist
            </NavLink>
          </nav>
        )}
      </div>

      <nav aria-label="Sections" className="min-h-0 flex-1 overflow-y-auto">
        <ul className="grid gap-1">
          {items.map(({ label, to, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={navLinkClasses} onClick={onNavigate}>
                <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4">
        <AppearanceSection />
      </div>

      <div className="grid gap-1 border-t border-border px-4 pt-6">
        <button
          type="button"
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-3 py-2 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
        >
          <Flag className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Report an issue
        </button>

        <Link
          to="/"
          className="flex items-center gap-3 py-2 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Back to website
        </Link>

        <Form method="post" action="/logout">
          <button
            type="submit"
            className="flex items-center gap-3 py-2 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
          >
            <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Log out
          </button>
        </Form>
      </div>

      <ReportIssueDialog open={isReportOpen} onOpenChange={setIsReportOpen} />
    </div>
  );
}
