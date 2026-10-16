import { Form, NavLink, Outlet, redirect } from "react-router";
import type { Route } from "./+types/portal-layout";
import {
  canUseAdmin,
  canUseArtist,
  currentUserContext,
  fetchCurrentUser,
} from "~/lib/current-user";
import { cn } from "~/lib/utils";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ request, context }) => {
    const user = await fetchCurrentUser(request.signal);

    if (!user) {
      throw redirect("/login");
    }

    context.set(currentUserContext, user);
  },
];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  return { me: context.get(currentUserContext) };
}

const toggleClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-accent",
  );

export default function PortalLayout({ loaderData }: Route.ComponentProps) {
  const { me } = loaderData;
  const canSwitch = canUseAdmin(me) && canUseArtist(me);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="font-display text-xl">As Above · Portal</p>

        {canSwitch && (
          <nav aria-label="Dashboard" className="flex border border-border">
            <NavLink to="/portal/admin" className={toggleClasses}>
              Admin
            </NavLink>
            <NavLink to="/portal/artist" className={toggleClasses}>
              Artist
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">{me.name}</p>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
            >
              Log out
            </button>
          </Form>
        </div>
      </header>

      <main className="px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
