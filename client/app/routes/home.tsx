import type { Route } from "./+types/home";
import { Hero } from "~/components/home/hero";

export function meta() {
  return [
    { title: "As Above Tattoo | Custom Tattoo Studio in Salt Lake City" },
    {
      name: "description",
      content:
        "Discover custom tattoo art at As Above Tattoo in Salt Lake City, Utah. Explore our artists, portfolio, and booking options.",
    },
  ] satisfies Route.MetaDescriptors;
}

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
