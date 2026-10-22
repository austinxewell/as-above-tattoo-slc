import { useEffect, useId } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import type { ShopDetails } from "~/lib/shop";

const labelClasses = "text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground";

type AddressEditFormProps = {
  shop: ShopDetails;
  onClose: () => void;
};

export function AddressEditForm({ shop, onClose }: AddressEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const id = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const fields = [
    { name: "street", label: "Street", value: shop.street, maxLength: 100, wide: true },
    { name: "city", label: "City", value: shop.city, maxLength: 60 },
    { name: "state", label: "State", value: shop.state, maxLength: 2 },
    { name: "zip", label: "ZIP", value: shop.zip, maxLength: 10 },
  ];

  return (
    <fetcher.Form
      method="post"
      aria-label="Edit address"
      className="grid gap-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="address" />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_5rem_8rem]">
        {fields.map((field, index) => (
          <div key={field.name} className={field.wide ? "grid gap-2 sm:col-span-3" : "grid gap-2"}>
            <label htmlFor={`${id}-${field.name}`} className={labelClasses}>
              {field.label}
            </label>
            <input
              id={`${id}-${field.name}`}
              name={field.name}
              type="text"
              defaultValue={field.value}
              maxLength={field.maxLength}
              required
              autoFocus={index === 0}
              className={controlClasses}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            "Shown in the footer, on the home page and in calendar events."
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
            {isSaving ? "Saving" : "Save"}
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
