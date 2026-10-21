import type { Route } from "./+types/settings";
import { fetchSiteSettings, handleSiteSettingsAction } from "~/lib/site-settings";
import { BookingSwitch } from "~/components/portal/site-content/booking-switch";
import { PublishingStandardsForm } from "~/components/portal/site-content/publishing-standards-form";

export function meta() {
  return [{ title: "Settings | Site content | Portal" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { settings: await fetchSiteSettings(request.signal) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleSiteSettingsAction(request);
}

export default function SiteContentSettings({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
      <section aria-labelledby="booking-heading" className="lg:col-start-2 lg:row-start-1">
        <h2 id="booking-heading" className="font-display text-xl uppercase">
          Online booking
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn the booking request form on or off for the whole site.
        </p>
        <div className="mt-4">
          <BookingSwitch
            enabled={loaderData.settings.bookingRequestsEnabled}
            labelledBy="booking-heading"
          />
        </div>
      </section>

      <section aria-labelledby="publishing-heading" className="lg:col-start-1 lg:row-start-1">
        <h2 id="publishing-heading" className="font-display text-xl uppercase">
          Publishing standards
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What every artist needs before they can publish their page.
        </p>

        <div className="mt-4">
          <PublishingStandardsForm standards={loaderData.settings.publishing} />
        </div>
      </section>
    </div>
  );
}
