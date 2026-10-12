import type { Route } from "./+types/pricing";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Pricing | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Pricing() {
  return <ComingSoon title="Pricing" />;
}
