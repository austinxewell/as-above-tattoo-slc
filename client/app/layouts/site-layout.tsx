import { Outlet } from "react-router";
import { SiteHeader } from "../components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";

export default function SiteLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SiteHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <main>
          <Outlet />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
