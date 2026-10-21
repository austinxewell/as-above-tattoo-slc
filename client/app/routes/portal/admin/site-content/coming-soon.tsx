import { useLocation } from "react-router";
import { siteContentTabs } from "~/components/portal/site-content/tabs";

export function meta() {
  return [{ title: "Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export default function SiteContentComingSoon() {
  const { pathname } = useLocation();
  const tab = siteContentTabs.find((item) => pathname.endsWith(`/${item.path}`));

  return (
    <div className="mt-10 border border-dashed border-border px-6 py-14 text-center">
      <h2 className="font-display text-2xl">{tab?.title ?? "This section"} is coming soon</h2>
      <p className="mt-3 text-muted-foreground">
        Editing this page's text is coming in a later update. For now it's managed for you.
      </p>
    </div>
  );
}
