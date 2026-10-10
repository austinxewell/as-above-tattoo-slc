import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="dark min-h-screen bg-background p-8 text-foreground">
      <section className="mx-auto max-w-3xl rounded-xl bg-surface p-8">
        <p className="font-sans text-muted-foreground">
          As Above Tattoo SLC
        </p>

        <h1 className="mt-4 font-display text-4xl">
          Art that stays with you.
        </h1>

        <p className="mt-4 text-muted-foreground">
          A test of our new design system.
        </p>

        <button
          type="button"
          className="mt-6 rounded-md bg-accent px-6 py-3 text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Explore the artists
        </button>
      </section>
    </main>
  );
}
