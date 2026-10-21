import { useEffect, useId } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const controlClasses =
  "w-full border border-border bg-background px-3 py-2.5 text-base leading-7 outline-none transition-colors focus-visible:border-accent aria-invalid:border-destructive";

type TextEditFormProps = {
  field: string;
  label: string;
  multiline?: boolean;
  inputType?: "text" | "url";
  maxLength: number;
  hint?: string;
  draft: string;
  onDraftChange: (draft: string) => void;
  onClose: () => void;
};

export function TextEditForm({
  field,
  label,
  multiline = false,
  inputType = "text",
  maxLength,
  hint,
  draft,
  onDraftChange,
  onClose,
}: TextEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const inputId = useId();
  const statusId = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const sharedProps = {
    id: inputId,
    name: "value",
    value: draft,
    maxLength,
    autoFocus: true,
    "aria-describedby": statusId,
    "aria-invalid": error ? true : undefined,
  };

  return (
    <fetcher.Form
      method="post"
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value={field} />
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      {multiline ? (
        <textarea
          {...sharedProps}
          rows={5}
          onChange={(event) => onDraftChange(event.target.value)}
          className={cn(controlClasses, "resize-y")}
        />
      ) : (
        <input
          {...sharedProps}
          type={inputType}
          onChange={(event) => onDraftChange(event.target.value)}
          className={controlClasses}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={statusId} className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            <>
              {hint && `${hint} · `}
              <span className="tabular-nums">
                {draft.length} / {maxLength}
              </span>
            </>
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
