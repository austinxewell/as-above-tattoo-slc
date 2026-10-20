import { Form, useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  ids?: string[];
  error?: string | null;
};

export function DeleteDialog({ open, onOpenChange, count, ids, error }: DeleteDialogProps) {
  const navigation = useNavigation();
  const isDeleting =
    navigation.state === "submitting" && navigation.formData?.get("intent") === "delete";
  const noun = count === 1 ? "request" : "requests";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-border bg-background">
        <DialogTitle className="font-display text-2xl uppercase">
          Delete {count} {noun}?
        </DialogTitle>
        <DialogDescription className="leading-6 text-muted-foreground">
          This permanently removes {count === 1 ? "it" : "them"} and can't be undone. Use it for
          spam or test requests. To keep a real client's history, archive instead.
        </DialogDescription>

        <Form method="post" className="mt-4 flex flex-wrap justify-end gap-3">
          {ids?.map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            name="intent"
            value="delete"
            variant="destructive"
            size="sm"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting" : `Delete ${count} ${noun}`}
            {isDeleting && (
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            )}
          </Button>
        </Form>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
