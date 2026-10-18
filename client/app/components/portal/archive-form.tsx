import { Form, useNavigation } from "react-router";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { BookingActionResult } from "~/lib/bookings";

type ArchiveFormProps = {
  archived: boolean;
  result?: BookingActionResult;
};

export function ArchiveForm({ archived, result }: ArchiveFormProps) {
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting" && navigation.formData?.has("intent") === true;
  const failed = result && (result.error || result.count === 0);

  return (
    <Form method="post" className="mt-6">
      <Button
        type="submit"
        name="intent"
        value={archived ? "unarchive" : "archive"}
        variant="outline"
        size="sm"
        disabled={isSaving}
      >
        {archived ? "Unarchive" : "Archive"}
        {isSaving && (
          <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
        )}
      </Button>

      {result && !failed && !isSaving && (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm text-success">
          <Check className="size-4" strokeWidth={2} aria-hidden="true" />
          {result.intent === "archive"
            ? "Request archived. It's now under the Archived view."
            : "Request unarchived. It's back in the active list."}
        </p>
      )}

      {failed && !isSaving && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {result.error ?? "This request couldn't be updated. Refresh and try again."}
        </p>
      )}
    </Form>
  );
}
