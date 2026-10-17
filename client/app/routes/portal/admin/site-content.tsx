import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Site Content | Portal" }, { name: "robots", content: "noindex" }];
}

export default function AdminSiteContent() {
  return (
    <PortalPlaceholder
      title="Site Content"
      description="About, pricing, booking and after care text."
    />
  );
}
