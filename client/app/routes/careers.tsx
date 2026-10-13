import type { Route } from "./+types/careers";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Careers | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Shop() {
  return <ComingSoon title="Careers" />;
}
