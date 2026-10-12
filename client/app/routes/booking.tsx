import type { Route } from "./+types/home";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Booking | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Booking() {
  return (
    <main>
      <ComingSoon title="Booking" />
    </main>
  );
}
