import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Profile | Portal" }, { name: "robots", content: "noindex" }];
}

export default function ArtistProfile() {
  return (
    <PortalPlaceholder
      title="My Profile"
      description="Your bio, statement, specialties, and booking details."
    />
  );
}
