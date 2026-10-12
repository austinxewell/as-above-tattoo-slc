import type { Route } from "./+types/home";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "After Care | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function AfterCare() {
  return (
    <main>
      <ComingSoon title="After Care" />
    </main>
  );
}
