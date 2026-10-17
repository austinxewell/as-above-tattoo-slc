import { PortalPlaceholder } from "~/components/portal/portal-placeholder";

export function meta() {
  return [{ title: "Bookings | Portal" }, { name: "robots", content: "noindex" }];
}

export default function AdminBookings() {
  return (
    <PortalPlaceholder title="Bookings" description="Every booking request, with status updates." />
  );
}
