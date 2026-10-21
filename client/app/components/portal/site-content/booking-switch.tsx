import { useId } from "react";
import { useFetcher } from "react-router";
import { cn } from "~/lib/utils";
import type { SiteSettingsActionResult } from "~/lib/site-settings";

type BookingSwitchProps = {
  enabled: boolean;
  labelledBy: string;
};

export function BookingSwitch({ enabled, labelledBy }: BookingSwitchProps) {
  const fetcher = useFetcher<SiteSettingsActionResult>();
  const descriptionId = useId();
  const pending = fetcher.formData?.get("enabled");
  const isOn = pending != null ? pending === "true" : enabled;
  const error =
    fetcher.state === "idle" && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  return (
    <fetcher.Form
      method="post"
      className="flex items-center justify-between gap-6 border border-border bg-surface px-5 py-4"
    >
      <input type="hidden" name="intent" value="booking" />

      <div id={descriptionId} aria-live="polite" className="min-w-0">
        <p className="font-medium">{isOn ? "On" : "Off"}</p>
        <p className="text-sm text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : isOn ? (
            "Clients can send booking requests from the site."
          ) : (
            "The booking page says requests aren't open yet."
          )}
        </p>
      </div>

      <button
        type="submit"
        name="enabled"
        value={String(!isOn)}
        role="switch"
        aria-checked={isOn}
        aria-labelledby={labelledBy}
        aria-describedby={descriptionId}
        className={cn(
          "relative h-7 w-13 shrink-0 border transition-colors",
          isOn ? "border-accent bg-accent" : "border-border bg-surface-raised",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-[3px] left-[3px] size-5 transition-transform",
            isOn ? "translate-x-6 bg-accent-foreground" : "bg-muted-foreground",
          )}
        />
      </button>
    </fetcher.Form>
  );
}
