import type { Route } from "./+types/artist";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Artist | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}

export default function Artist() {
  return <ComingSoon title="Artist profile" />;
}
