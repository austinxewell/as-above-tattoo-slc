import { isRouteErrorResponse, Outlet } from "react-router";
import type { Route } from "./+types/site-layout";
import { fetchCurrentUser } from "~/lib/current-user";
import { fetchShopDetails } from "~/lib/shop";
import { SiteHeader } from "../components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { NotFound } from "~/components/shared/not-found";
import { StaffBar } from "~/components/layout/staff-bar";
import { ErrorState } from "~/components/shared/error-state";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [user, shop] = await Promise.all([
    fetchCurrentUser(request.signal).catch(() => null),
    fetchShopDetails(request.signal).catch(() => null),
  ]);

  return { staffName: user?.name ?? null, shop };
}

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {loaderData.staffName && <StaffBar name={loaderData.staffName} />}

      <SiteHeader shop={loaderData.shop} />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter shop={loaderData.shop} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">{isNotFound ? <NotFound /> : <ErrorState />}</main>

      <SiteFooter />
    </div>
  );
}
