import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Staff | Portal" }, { name: "robots", content: "noindex" }];
}

export default function AdminStaff() {
  return <PortalPlaceholder title="Staff" description="Staff accounts, roles, and invitations." />;
}
