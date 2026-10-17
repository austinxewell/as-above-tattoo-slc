import { isRouteErrorResponse, Link, Outlet } from "react-router";
import type { Route } from "./+types/site-layout";
import { fetchCurrentUser } from "~/lib/current-user";
import { SiteHeader } from "../components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { NotFound } from "~/components/shared/not-found";
import { StaffBar } from "~/components/layout/staff-bar";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    const user = await fetchCurrentUser(request.signal);
    return { staffName: user?.name ?? null };
  } catch {
    return { staffName: null };
  }
}

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {loaderData.staffName && <StaffBar name={loaderData.staffName} />}

      <SiteHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {isNotFound ? (
          <NotFound />
        ) : (
          <section className="flex min-h-[60svh] flex-col justify-center px-6 py-24 md:px-[6.2vw]">
            <h1 className="font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl">
              Something went wrong
            </h1>
            <p className="mt-6 max-w-[390px] text-muted-foreground">
              Please refresh the page or try again in a moment.
            </p>
            <Link
              to="/"
              className="mt-8 self-start border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
            >
              Back to home
            </Link>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
