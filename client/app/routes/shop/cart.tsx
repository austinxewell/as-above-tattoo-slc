import type { Route } from "./+types/cart";
import { ComingSoon } from "~/components/shared/coming-soon";

export function meta() {
  return [
    { title: "Cart | As Above Tattoo" },
    { name: "robots", content: "noindex" },
  ] satisfies Route.MetaDescriptors;
}
export default function Cart() {
  return (
    <main>
      <ComingSoon title="Shopping Cart" />
    </main>
  );
}
