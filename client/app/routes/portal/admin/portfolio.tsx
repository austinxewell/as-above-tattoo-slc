import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Portfolio | Portal" }, { name: "robots", content: "noindex" }];
}

export default function AdminPortfolio() {
  return (
    <PortalPlaceholder
      title="Portfolio"
      description="Every piece in the portfolio, including tags and featured work."
    />
  );
}
