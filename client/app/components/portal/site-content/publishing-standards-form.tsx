import { useState } from "react";
import { useFetcher } from "react-router";
import { Check } from "lucide-react";
import type { PublishingStandards, SiteSettingsActionResult } from "~/lib/site-settings";
import { Button } from "~/components/ui/button";
import { NumberStepper } from "./number-stepper";

type SwitchKey = "photo" | "bio" | "statement" | "instagram" | "booking";

const switches: { key: SwitchKey; label: string; detail?: string }[] = [
  { key: "photo", label: "Profile photo" },
  { key: "bio", label: "Bio" },
  { key: "statement", label: "Statement" },
  { key: "instagram", label: "Instagram handle" },
  { key: "booking", label: "Booking details", detail: "Minimum, rate, deposit and availability" },
];

export function PublishingStandardsForm({ standards }: { standards: PublishingStandards }) {
  const fetcher = useFetcher<SiteSettingsActionResult>();
  const [values, setValues] = useState(standards);
  const isSaving = fetcher.state !== "idle";
  const result = fetcher.state === "idle" ? fetcher.data : undefined;

  const isDirty = (Object.keys(standards) as (keyof PublishingStandards)[]).some(
    (key) => values[key] !== standards[key],
  );

  function update<K extends keyof PublishingStandards>(key: K, value: PublishingStandards[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="standards" />

      <ul className="divide-y divide-border border border-border bg-surface">
        {switches.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-center justify-between gap-6 px-5 py-4">
              <span className="min-w-0">
                <span className="block font-medium">{item.label}</span>
                {item.detail && (
                  <span className="block text-sm text-muted-foreground">{item.detail}</span>
                )}
              </span>
              <input
                type="checkbox"
                name={item.key}
                checked={values[item.key]}
                onChange={(event) => update(item.key, event.target.checked)}
                className="size-4 shrink-0 accent-accent"
              />
            </label>
          </li>
        ))}
        <li>
          <NumberStepper
            name="minSpecialties"
            label="Specialties"
            max={10}
            value={values.minSpecialties}
            onChange={(value) => update("minSpecialties", value)}
          />
        </li>
        <li>
          <NumberStepper
            name="minPieces"
            label="Portfolio pieces"
            max={50}
            value={values.minPieces}
            onChange={(value) => update("minPieces", value)}
          />
        </li>
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="brand" size="sm" disabled={!isDirty || isSaving}>
          {isSaving ? "Saving…" : "Save standards"}
        </Button>

        {isDirty && !isSaving && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => setValues(standards)}
          >
            Discard changes
          </Button>
        )}

        <p role="status" className="text-sm">
          {result && !result.ok ? (
            <span className="text-destructive">{result.error}</span>
          ) : isDirty ? (
            <span className="text-muted-foreground">Unsaved changes</span>
          ) : (
            result?.ok && (
              <span className="inline-flex items-center gap-1.5 text-success">
                <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                Standards saved.
              </span>
            )
          )}
        </p>
      </div>
    </fetcher.Form>
  );
}
