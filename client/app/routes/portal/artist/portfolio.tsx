import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Portfolio | Portal" }, { name: "robots", content: "noindex" }];
}

export default function ArtistPortfolio() {
  return <PortalPlaceholder title="My Portfolio" description="Your pieces in the portfolio." />;
}
