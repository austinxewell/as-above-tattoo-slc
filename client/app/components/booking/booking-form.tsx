import { Form, useSearchParams, useNavigation, useActionData } from "react-router";
import type { clientAction } from "~/routes/booking";
import { ArrowRight, LoaderCircle, TriangleAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

type BookingFormProps = {
  artists: { slug: string; name: string; isBooking: boolean }[];
};

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const fieldClasses =
  "mt-3 w-full border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent";
const triggerClasses =
  "mt-3 w-full rounded-none border-border bg-background px-4 py-3 text-base data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0";
const contentClasses = "rounded-none border border-border bg-background ring-0";

export function BookingForm({ artists }: BookingFormProps) {
  const actionData = useActionData<typeof clientAction>();
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const requestedArtist = searchParams.get("artist");
  const preselected = artists.some((artist) => artist.slug === requestedArtist && artist.isBooking)
    ? requestedArtist
    : "any";
  const artistItems = [
    { value: "any", label: "No preference", disabled: false },
    ...artists.map((artist) => ({
      value: artist.slug,
      label: artist.isBooking ? artist.name : `${artist.name} (books closed)`,
      disabled: !artist.isBooking,
    })),
  ];

  const sizeItems = [
    { value: "small", label: "Small (under 2 inches)" },
    { value: "medium", label: "Medium (2–5 inches)" },
    { value: "large", label: "Large (5+ inches)" },
    { value: "project", label: "Large project (sleeve, back piece)" },
  ];

  return (
    <Form method="post" encType="multipart/form-data" className="grid gap-8 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="artist" className={labelClasses}>
          Artist
        </label>
        <Select name="artist" items={artistItems} defaultValue={preselected}>
          <SelectTrigger id="artist" className={triggerClasses}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className={contentClasses}>
            {artistItems.map((item) => (
              <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-invalid={errors?.name ? true : undefined}
          aria-describedby={errors?.name ? "name-error" : undefined}
          className={fieldClasses}
        />
        {errors?.name && (
          <p id="name-error" className="mt-2 text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={errors?.email ? true : undefined}
          aria-describedby={errors?.email ? "email-error" : undefined}
          className={fieldClasses}
        />
        {errors?.email && (
          <p id="email-error" className="mt-2 text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Phone{" "}
          <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="placement" className={labelClasses}>
          Placement
        </label>
        <input
          id="placement"
          name="placement"
          type="text"
          required
          placeholder="e.g. Left forearm"
          aria-invalid={errors?.placement ? true : undefined}
          aria-describedby={errors?.placement ? "placement-error" : undefined}
          className={fieldClasses}
        />
        {errors?.placement && (
          <p id="placement-error" className="mt-2 text-sm text-destructive">
            {errors.placement}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="size" className={labelClasses}>
          Approximate size
        </label>
        <Select name="size" items={sizeItems} required>
          <SelectTrigger
            id="size"
            aria-invalid={errors?.size ? true : undefined}
            aria-describedby={errors?.size ? "size-error" : undefined}
            className={triggerClasses}
          >
            <SelectValue placeholder="Choose a size" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className={contentClasses}>
            {sizeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.size && (
          <p id="size-error" className="mt-2 text-sm text-destructive">
            {errors.size}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="budget" className={labelClasses}>
          Budget{" "}
          <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="budget"
          name="budget"
          type="text"
          placeholder="e.g. $300–500"
          className={fieldClasses}
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="idea" className={labelClasses}>
          Your idea
        </label>
        <textarea
          id="idea"
          name="idea"
          required
          rows={6}
          placeholder="Describe what you'd like, the style, and anything that's important to you."
          aria-invalid={errors?.idea ? true : undefined}
          aria-describedby={errors?.idea ? "idea-hint idea-error" : "idea-hint"}
          className={fieldClasses}
        />
        <p id="idea-hint" className="mt-2 text-sm text-muted-foreground">
          Have reference images? Mention them here and your artist will ask for them when they reach
          out.
        </p>
        {errors?.idea && (
          <p id="idea-error" className="mt-2 text-sm text-destructive">
            {errors.idea}
          </p>
        )}
      </div>

      {/* ORIGINAL: restore once reference images can be uploaded and stored.
      <div className="md:col-span-2">
        <label htmlFor="references" className={labelClasses}>
          Reference images{" "}
          <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="references"
          name="references"
          type="file"
          accept="image/*"
          multiple
          className={`${fieldClasses} file:mr-4 file:border-0 file:bg-transparent file:text-[0.65rem] file:uppercase file:tracking-[0.2em] file:text-accent`}
        />
      </div>
            */}

      <div className="md:col-span-2">
        <label htmlFor="availability" className={labelClasses}>
          When are you available?{" "}
          <span className="text-muted-foreground normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="availability"
          name="availability"
          type="text"
          placeholder="e.g. Weekday evenings, or any Saturday"
          className={fieldClasses}
        />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2">
        {errors?.form && (
          <div
            role="alert"
            className="mb-8 flex gap-4 border border-destructive/40 bg-destructive/10 p-5"
          >
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-destructive"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-destructive">
                Request not sent
              </p>
              <p className="mt-2 leading-7">{errors.form}</p>
            </div>
          </div>
        )}

        <Button type="submit" variant="brand" size="cta" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Sending request
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            </>
          ) : (
            <>
              Send request
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </>
          )}
        </Button>
      </div>
    </Form>
  );
}
