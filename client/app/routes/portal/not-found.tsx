import { data } from "react-router";

export function clientLoader() {
  throw data("Not found", { status: 404 });
}

export default function PortalNotFound() {
  return null;
}
