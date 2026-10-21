import { replace } from "react-router";

export function clientLoader() {
  throw replace("/portal/admin/site-content/settings");
}

export default function SiteContentIndex() {
  return null;
}
