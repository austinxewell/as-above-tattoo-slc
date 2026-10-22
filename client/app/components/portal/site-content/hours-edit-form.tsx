import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { TimeField } from "~/components/portal/bookings/time-field";
import { dayLabels, type ShopHours } from "~/lib/shop";

function HoursRow({ entry }: { entry: ShopHours }) {
  const [isOpen, setIsOpen] = useState(entry.isOpen);
  const day = dayLabels[entry.day].long;

  return (
    <li className="grid items-center gap-3 border-b border-border py-3 last:border-b-0 md:grid-cols-[7rem_6rem_1fr]">
      <span className="text-sm font-medium uppercase tracking-widest">{day}</span>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name={`${entry.day}-open`}
          checked={isOpen}
          onChange={(event) => setIsOpen(event.target.checked)}
          className="size-4 accent-accent"
        />
        Open
      </label>

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 transition-opacity",
          !isOpen && "opacity-40",
        )}
        inert={!isOpen}
      >
        <TimeField
          name={`${entry.day}-opensAt`}
          legend={`${day} opens at`}
          legendClassName="sr-only"
          defaultValue={entry.opensAt}
        />
        <span className="text-sm text-muted-foreground">to</span>
        <TimeField
          name={`${entry.day}-closesAt`}
          legend={`${day} closes at`}
          legendClassName="sr-only"
          defaultValue={entry.closesAt}
        />
      </div>
    </li>
  );
}

type HoursEditFormProps = {
  hours: ShopHours[];
  onClose: () => void;
};

export function HoursEditForm({ hours, onClose }: HoursEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <fetcher.Form
      method="post"
      aria-label="Edit hours"
      className="grid gap-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="hours" />

      <ul className="border-y border-border">
        {hours.map((entry) => (
          <HoursRow key={entry.day} entry={entry} />
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            "Closed days keep their times, so reopening a day restores them."
          )}
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="brand" size="sm" disabled={isSaving}>
            {isSaving ? "Saving" : "Save hours"}
            {isSaving && (
              <LoaderCircle
                className="size-3.5 animate-spin"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}
