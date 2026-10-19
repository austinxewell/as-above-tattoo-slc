import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle, Plus, X } from "lucide-react";
import type { ProfileActionResult } from "~/lib/artist-profile";
import { Button } from "~/components/ui/button";
import { controlClasses } from "./text-edit-form";

type ListItem = { id: string; value: string };

function toItems(values: string[]): ListItem[] {
  const items = values.map((value) => ({ id: crypto.randomUUID(), value }));
  return items.length > 0 ? items : [{ id: crypto.randomUUID(), value: "" }];
}

type ListEditFormProps = {
  label: string;
  itemLabel: string;
  intent: string;
  name: string;
  maxItems: number;
  maxLength: number;
  initialItems: string[];
  hidden?: Record<string, string>;
  placeholder?: string;
  onClose: () => void;
};

export function ListEditForm({
  label,
  itemLabel,
  intent,
  name,
  maxItems,
  maxLength,
  initialItems,
  hidden = {},
  placeholder,
  onClose,
}: ListEditFormProps) {
  const fetcher = useFetcher<ProfileActionResult>();
  const [items, setItems] = useState(() => toItems(initialItems));
  const statusId = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const filledCount = items.filter((item) => item.value.trim()).length;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  function update(id: string, value: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, value } : item)));
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function add() {
    setItems((current) => [...current, { id: crypto.randomUUID(), value: "" }]);
  }

  return (
    <fetcher.Form
      method="post"
      aria-label={label}
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value={intent} />
      {Object.entries(hidden).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <ul className="grid gap-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <input
              type="text"
              name={name}
              value={item.value}
              onChange={(event) => update(item.id, event.target.value)}
              maxLength={maxLength}
              placeholder={placeholder}
              autoFocus={index === items.length - 1}
              aria-label={`${itemLabel} ${index + 1}`}
              aria-describedby={statusId}
              className={controlClasses}
            />
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove ${itemLabel} ${index + 1}`}
              className="grid size-11 shrink-0 place-items-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        disabled={items.length >= maxItems}
        className="inline-flex w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
      >
        <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        Add {itemLabel}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={statusId} className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            <span className="tabular-nums">
              {filledCount} of {maxItems} · up to {maxLength} characters each
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
