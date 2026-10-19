import { useEffect, useId } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ArtistBookingDetails, ProfileActionResult } from "~/lib/artist-profile";
import { Button } from "~/components/ui/button";
import { controlClasses } from "./text-edit-form";

const bookingFields = [
  { name: "minimum", label: "Minimum", placeholder: "$120" },
  { name: "rate", label: "Rate", placeholder: "$160/hr" },
  { name: "deposit", label: "Deposit", placeholder: "$75, goes toward your tattoo" },
  { name: "availability", label: "Availability", placeholder: "Booking through next month" },
] as const;

type BookingEditFormProps = {
  booking: ArtistBookingDetails;
  onClose: () => void;
};

export function BookingEditForm({ booking, onClose }: BookingEditFormProps) {
  const fetcher = useFetcher<ProfileActionResult>();
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const isSaving = fetcher.state !== "idle";
  const result = isSaving ? undefined : fetcher.data;
  const error = result && !result.ok ? result.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <fetcher.Form
      method="post"
      aria-label="Prices and dates"
      className="grid gap-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="booking" />
      {booking.notes.map((note) => (
        <input key={note} type="hidden" name="notes" value={note} />
      ))}

      <div className="grid gap-4 sm:grid-cols-3">
        {bookingFields.map((field, index) => {
          const id = `${baseId}-${field.name}`;
          const isInvalid = result?.field === `booking.${field.name}`;

          return (
            <div
              key={field.name}
              className={cn("grid gap-1.5", field.name === "availability" && "sm:col-span-3")}
            >
              <label
                htmlFor={id}
                className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                defaultValue={booking[field.name]}
                placeholder={field.placeholder}
                maxLength={80}
                required
                autoFocus={index === 0}
                aria-invalid={isInvalid || undefined}
                aria-describedby={isInvalid ? errorId : undefined}
                className={controlClasses}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span id={errorId} role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            "Up to 80 characters each"
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
