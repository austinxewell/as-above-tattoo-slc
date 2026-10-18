import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { BrandLoader } from "./components/shared/brand-loader";
import { NotFound } from "./components/shared/not-found";
import { ErrorState } from "./components/shared/error-state";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:opsz,wght@14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div role="status" className="flex min-h-screen items-center justify-center bg-background">
      <BrandLoader />
      <span className="sr-only">Loading As Above Tattoo</span>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      {isNotFound ? <NotFound /> : <ErrorState homeTo="/" homeLabel="Back to website" />}

      {import.meta.env.DEV && error instanceof Error && (
        <pre className="mx-6 mb-12 overflow-x-auto border border-border p-4 text-xs text-muted-foreground md:mx-[6.2vw]">
          {error.stack}
        </pre>
      )}
    </main>
  );
}
