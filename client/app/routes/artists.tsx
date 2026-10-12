import type { Route } from "./+types/home";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Artists | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Artists() {
  return (
    <main>
      <ComingSoon title="Artists" />
    </main>
  );
}
