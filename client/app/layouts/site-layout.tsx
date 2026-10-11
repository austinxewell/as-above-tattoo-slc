import { Outlet } from "react-router";
import { SiteHeader } from "../components/layout/site-header";

export default function SiteLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SiteHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <main>
          <Outlet />
        </main>

        <footer>{/* Shared site footer will go here. */}</footer>
      </div>
    </div>
  );
}
