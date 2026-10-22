import type { ReactNode } from "react";
import { Form, Link, useNavigation } from "react-router";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import {
  bookingStatuses,
  manualSources,
  sizeLabels,
  sourceLabels,
  statusLabels,
  type BookingSize,
} from "~/lib/bookings";

type Choice = { value: string; label: string };

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const legendClasses = "font-display text-xl uppercase";
const triggerClasses =
  "w-full rounded-none border-border bg-background px-3 py-2.5 text-base data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0";
const contentClasses = "rounded-none border border-border bg-background ring-0";

const sourceItems = manualSources.map((source) => ({ value: source, label: sourceLabels[source] }));
const statusItems = bookingStatuses.map((status) => ({
  value: status,
  label: statusLabels[status],
}));
const sizeItems = (Object.keys(sizeLabels) as BookingSize[]).map((size) => ({
  value: size,
  label: sizeLabels[size],
}));

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, optional, className, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {optional && (
          <span className="text-muted-foreground normal-case tracking-normal"> (optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

type ChoiceFieldProps = {
  id: string;
  label: string;
  items: Choice[];
  placeholder?: string;
  defaultValue?: string;
};

function ChoiceField({ id, label, items, placeholder, defaultValue }: ChoiceFieldProps) {
  return (
    <Field id={id} label={label}>
      <Select name={id} items={items} defaultValue={defaultValue} required>
        <SelectTrigger id={id} className={triggerClasses}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} className={contentClasses}>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

type NewBookingFormProps = {
  artists?: { slug: string; name: string }[];
  error?: string | null;
  cancelTo: string;
};

export function NewBookingForm({ artists, error, cancelTo }: NewBookingFormProps) {
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  return (
    <Form
      method="post"
      className="mt-10 grid max-w-7xl gap-x-16 gap-y-12 xl:grid-cols-2 xl:items-start"
    >
      <div className="grid gap-12">
        <fieldset>
          <legend className={legendClasses}>Booking</legend>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ChoiceField
              id="source"
              label="Came from"
              items={sourceItems}
              placeholder="Choose a source"
            />
            <ChoiceField
              id="status"
              label="Status"
              items={statusItems}
              placeholder="Choose a status"
            />
            {artists && (
              <ChoiceField
                id="artist"
                label="Artist"
                items={[
                  { value: "none", label: "No preference" },
                  ...artists.map((artist) => ({ value: artist.slug, label: artist.name })),
                ]}
                defaultValue="none"
              />
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClasses}>Client</legend>
          <div className="mt-6 grid gap-6">
            <Field id="name" label="Name">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
                className={controlClasses}
              />
            </Field>

            <fieldset className="grid gap-6 border border-border px-4 pt-2 pb-5 sm:grid-cols-2">
              <legend className="px-2 text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                How to reach them · at least one
              </legend>
              <Field id="email" label="Email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  className={controlClasses}
                />
              </Field>
              <Field id="phone" label="Phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="off"
                  className={controlClasses}
                />
              </Field>
              <Field id="instagram" label="Instagram">
                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  placeholder="@handle"
                  autoComplete="off"
                  className={controlClasses}
                />
              </Field>
            </fieldset>
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className={legendClasses}>Tattoo</legend>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field id="placement" label="Placement">
            <input
              id="placement"
              name="placement"
              type="text"
              required
              placeholder="e.g. Left forearm"
              className={controlClasses}
            />
          </Field>
          <ChoiceField id="size" label="Size" items={sizeItems} placeholder="Choose a size" />
          <Field id="budget" label="Budget" optional>
            <input
              id="budget"
              name="budget"
              type="text"
              placeholder="e.g. $300–500"
              className={controlClasses}
            />
          </Field>
          <Field id="idea" label="Idea" className="sm:col-span-2">
            <textarea
              id="idea"
              name="idea"
              required
              rows={5}
              className={cn(controlClasses, "resize-y")}
            />
          </Field>
          <Field id="availability" label="Availability" optional className="sm:col-span-2">
            <input
              id="availability"
              name="availability"
              type="text"
              placeholder="e.g. Weekday evenings"
              className={controlClasses}
            />
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-6 xl:col-span-2">
        {error && (
          <div
            role="alert"
            className="flex gap-4 border border-destructive/40 bg-destructive/10 p-5"
          >
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-destructive"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="leading-7">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="brand" size="cta" disabled={isSaving}>
            {isSaving ? "Saving" : "Add booking"}
            {isSaving && (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            )}
          </Button>
          <Link
            to={cancelTo}
            className={cn(buttonVariants({ variant: "outline", size: "cta" }), "rounded-none")}
          >
            Cancel
          </Link>
        </div>
      </div>
    </Form>
  );
}
