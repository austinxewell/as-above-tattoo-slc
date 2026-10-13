import type { Route } from "./+types/not-found";
import { NotFound } from "~/components/shared/not-found";

export function meta() {
  return [
    { title: "Page not found | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}

export default function NotFoundRoute() {
  return <NotFound />;
}
