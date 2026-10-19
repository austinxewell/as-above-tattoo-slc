import { Form, useNavigation } from "react-router";
import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { bookingStatuses, isBookingStatus, statusLabels, type BookingStatus } from "~/lib/bookings";

type StatusFormProps = {
  currentStatus?: BookingStatus;
  error?: string | null;
  updatedTo?: BookingStatus | null;
  assignableArtists?: { slug: string; name: string }[];
  assignToSelf?: string;
  ids?: string[];
  submitLabel?: string;
  showAssignmentNote?: boolean;
};

const statusItems = bookingStatuses.map((status) => ({
  value: status,
  label: statusLabels[status],
}));

export function StatusForm({
  currentStatus,
  error,
  updatedTo,
  assignableArtists,
  assignToSelf,
  ids,
  submitLabel,
  showAssignmentNote,
}: StatusFormProps) {
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting" && navigation.formData?.has("status") === true;
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | undefined>(currentStatus);
  const needsArtist = Boolean(assignableArtists) && selectedStatus === "scheduled";

  return (
    <Form method="post" className="mt-8">
      {assignToSelf && <input type="hidden" name="assignTo" value={assignToSelf} />}

      {ids?.map((id) => (
        <input key={id} type="hidden" name="ids" value={id} />
      ))}

      <label htmlFor="status" className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">
        Status
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Select
          name="status"
          items={statusItems}
          defaultValue={currentStatus}
          onValueChange={(value) => {
            if (typeof value === "string" && isBookingStatus(value)) setSelectedStatus(value);
          }}
        >
          <SelectTrigger
            id="status"
            className="w-56 rounded-none border-border bg-background px-4 py-3 text-base data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0"
          >
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            className="rounded-none border border-border bg-background ring-0"
          >
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {needsArtist && assignableArtists && (
          <Select
            name="assignTo"
            items={assignableArtists.map((artist) => ({ value: artist.slug, label: artist.name }))}
          >
            <SelectTrigger
              aria-label="Assign to artist"
              className="w-56 rounded-none border-border bg-background px-4 py-3 text-base data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0"
            >
              <SelectValue placeholder="Assign to…" />
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              className="rounded-none border border-border bg-background ring-0"
            >
              {assignableArtists.map((artist) => (
                <SelectItem key={artist.slug} value={artist.slug}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button type="submit" variant="brand" size="cta" disabled={isSaving}>
          {isSaving ? (
            <>
              Saving
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            </>
          ) : (
            (submitLabel ?? "Update status")
          )}
        </Button>
      </div>

      {needsArtist && showAssignmentNote && (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Requests that already have an artist keep their artist. The artist you choose only applies
          to the "No preference" requests.
        </p>
      )}

      {updatedTo && !isSaving && (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-success">
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          Status updated to {statusLabels[updatedTo]}.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </Form>
  );
}
