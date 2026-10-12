import type { Route } from "./+types/home";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Portfolio | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Portfolio() {
  return (
    <main>
      <ComingSoon title="Portfolio" />
    </main>
  );
}
