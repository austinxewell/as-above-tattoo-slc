import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Artists | Portal" }, { name: "robots", content: "noindex" }];
}

export default function AdminArtists() {
  return (
    <PortalPlaceholder
      title="Artists"
      description="Artist profiles, rates, and whether their books are open."
    />
  );
}
