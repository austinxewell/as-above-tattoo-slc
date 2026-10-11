import type { Route } from "./+types/home";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "As Above Tattoo SLC" },
    {
      name: "description",
      content: "Explore the artists and tattoo work at As Above Tattoo SLC.",
    },
  ] satisfies Route.MetaDescriptors;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <p className="font-sans text-sm text-muted-foreground">AS ABOVE TATTOO SLC</p>
          <h1 className="mt-3 font-display text-5xl">Art that stays with you.</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            A visual test of our typography, colors, surfaces, and interactive elements.
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-2xl">Design tokens</h2>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-md bg-background p-3 text-sm">Background</div>
            <div className="rounded-md bg-surface-raised p-3 text-sm">Raised surface</div>
            <div className="rounded-md bg-accent px-4 py-3 text-sm text-accent-foreground">
              Accent
            </div>
          </div>

          <p className="text-muted-foreground">
            Muted text should remain readable against the surface.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
