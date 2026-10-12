import type { Route } from "../+types/home";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Shop | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Shop() {
  return (
    <main>
      <ComingSoon title="Shop" />
    </main>
  );
}
