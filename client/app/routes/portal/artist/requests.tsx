import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Requests | Portal" }, { name: "robots", content: "noindex" }];
}

export default function ArtistRequests() {
  return (
    <PortalPlaceholder
      title="My Requests"
      description={`Booking requests for you, plus "No prefences" requests.`}
    />
  );
}
