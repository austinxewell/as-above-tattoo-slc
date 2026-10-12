import type { Route } from "./+types/artists";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Artists | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Artists() {
  return <ComingSoon title="Artists" />;
}
