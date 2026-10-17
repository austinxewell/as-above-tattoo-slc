import { useState } from "react";
import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/portal-layout";
import { currentUserContext, fetchCurrentUser } from "~/lib/current-user";
import { PortalSidebar } from "~/components/portal/portal-sidebar";
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet";
import { PortalBrand } from "~/components/portal/portal-brand";
import { MenuTrigger } from "~/components/shared/menu-trigger";

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

export default function PortalLayout({ loaderData }: Route.ComponentProps) {
  const { me } = loaderData;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="dark sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background text-foreground md:block">
        <PortalSidebar user={me} />
      </aside>

      <header className="dark flex items-center justify-between border-b border-border bg-background px-6 py-4 text-foreground md:hidden">
        <PortalBrand />

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <MenuTrigger label="Open portal menu" />

          <SheetContent
            side="right"
            className="dark w-72 border-border bg-background p-0 text-foreground"
          >
            <SheetTitle className="sr-only">Portal menu</SheetTitle>
            <PortalSidebar user={me} onNavigate={() => setIsMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
