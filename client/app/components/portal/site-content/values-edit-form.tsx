import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle, Plus, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";

const MAX_VALUES = 8;

type ValueItem = { id: string; title: string; description: string };

type ValuesEditFormProps = {
  initialValues: { title: string; description: string }[];
  onClose: () => void;
};

export function ValuesEditForm({ initialValues, onClose }: ValuesEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const [items, setItems] = useState<ValueItem[]>(() =>
    initialValues.map((value) => ({ ...value, id: crypto.randomUUID() })),
  );
  const statusId = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  function update(id: string, changes: Partial<ValueItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function add() {
    setItems((current) => [...current, { id: crypto.randomUUID(), title: "", description: "" }]);
  }

  return (
    <fetcher.Form
      method="post"
      aria-label="Values"
      className="grid gap-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="values" />

      <ol className="grid gap-4">
        {items.map((item, index) => (
          <li key={item.id} className="grid gap-2 border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Value {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove value ${index + 1}`}
                className="grid size-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <input
              type="text"
              name="title"
              value={item.title}
              onChange={(event) => update(item.id, { title: event.target.value })}
              maxLength={40}
              placeholder="Title, e.g. Cleanliness"
              aria-label={`Value ${index + 1} title`}
              aria-describedby={statusId}
              autoFocus={index === items.length - 1 && item.title === ""}
              className={controlClasses}
            />
            <textarea
              name="description"
              value={item.description}
              onChange={(event) => update(item.id, { description: event.target.value })}
              maxLength={300}
              rows={2}
              placeholder="A sentence or two about it"
              aria-label={`Value ${index + 1} description`}
              aria-describedby={statusId}
              className={cn(controlClasses, "resize-y")}
            />
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={add}
        disabled={items.length >= MAX_VALUES}
        className="inline-flex w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
      >
        <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        Add value
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={statusId} className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            <span className="tabular-nums">
              {items.length} of {MAX_VALUES} · titles up to 40 characters, descriptions up to 300
            </span>
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
