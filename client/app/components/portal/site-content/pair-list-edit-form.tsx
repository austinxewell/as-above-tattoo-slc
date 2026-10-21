import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";

export type PairFieldSpec = {
  name: string;
  label: string;
  placeholder: string;
  maxLength: number;
};

export type PairItem = { first: string; second: string };

type PairListEditFormProps = {
  intent: string;
  label: string;
  noun: string;
  max: number;
  first: PairFieldSpec;
  second: PairFieldSpec;
  initialItems: PairItem[];
  onClose: () => void;
};

type EditableItem = PairItem & { id: string };

const iconButtonClasses =
  "grid size-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

export function PairListEditForm({
  intent,
  label,
  noun,
  max,
  first,
  second,
  initialItems,
  onClose,
}: PairListEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const [items, setItems] = useState<EditableItem[]>(() =>
    initialItems.map((item) => ({ ...item, id: crypto.randomUUID() })),
  );
  const statusId = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  function update(id: string, changes: Partial<PairItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function move(index: number, offset: -1 | 1) {
    setItems((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }

  function add() {
    setItems((current) => [...current, { id: crypto.randomUUID(), first: "", second: "" }]);
  }

  return (
    <fetcher.Form
      method="post"
      aria-label={label}
      className="grid gap-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value={intent} />

      <ol className="grid gap-4">
        {items.map((item, index) => {
          const position = `${noun} ${index + 1}`;

          return (
            <li key={item.id} className="grid gap-2 border border-border bg-surface-raised p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {position}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${position} up`}
                    className={iconButtonClasses}
                  >
                    <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${position} down`}
                    className={iconButtonClasses}
                  >
                    <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${position}`}
                    className={cn(
                      iconButtonClasses,
                      "hover:border-destructive hover:text-destructive",
                    )}
                  >
                    <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                name={first.name}
                value={item.first}
                onChange={(event) => update(item.id, { first: event.target.value })}
                maxLength={first.maxLength}
                placeholder={first.placeholder}
                aria-label={`${position} ${first.label}`}
                aria-describedby={statusId}
                autoFocus={index === items.length - 1 && item.first === ""}
                className={controlClasses}
              />
              <textarea
                name={second.name}
                value={item.second}
                onChange={(event) => update(item.id, { second: event.target.value })}
                maxLength={second.maxLength}
                rows={2}
                placeholder={second.placeholder}
                aria-label={`${position} ${second.label}`}
                aria-describedby={statusId}
                className={cn(controlClasses, "resize-y")}
              />
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={add}
        disabled={items.length >= max}
        className="inline-flex w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
      >
        <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        Add {noun.toLowerCase()}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={statusId} className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            <span className="tabular-nums">
              {items.length} of {max} · {first.label.toLowerCase()} up to {first.maxLength}{" "}
              characters, {second.label.toLowerCase()} up to {second.maxLength}
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
