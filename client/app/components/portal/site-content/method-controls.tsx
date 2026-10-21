import { useState } from "react";
import { useFetcher } from "react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { MethodInput } from "~/lib/after-care";

const iconButtonClasses =
  "grid size-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

type MethodControlsProps = {
  methods: MethodInput[];
  index: number;
};

// Reorder or delete one method. Each action sends the whole updated list.
export function MethodControls({ methods, index }: MethodControlsProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const [isConfirming, setIsConfirming] = useState(false);
  const isBusy = fetcher.state !== "idle";
  const error =
    fetcher.state === "idle" && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const name = methods[index].name;

  function submit(next: MethodInput[]) {
    fetcher.submit({ intent: "methods", methods: JSON.stringify(next) }, { method: "post" });
  }

  function move(offset: -1 | 1) {
    const next = [...methods];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    submit(next);
  }

  return (
    <div className="mt-4 grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={index === 0 || isBusy}
          aria-label={`Move ${name} up`}
          className={iconButtonClasses}
        >
          <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={index === methods.length - 1 || isBusy}
          aria-label={`Move ${name} down`}
          className={iconButtonClasses}
        >
          <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>

        {isConfirming ? (
          <span className="flex flex-wrap items-center gap-2 text-sm">
            Delete {name}?
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-none"
              disabled={isBusy}
              onClick={() => submit(methods.filter((_, i) => i !== index))}
            >
              {isBusy ? "Deleting…" : "Delete method"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => setIsConfirming(false)}
            >
              Keep it
            </Button>
          </span>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-none text-muted-foreground hover:text-destructive"
            disabled={methods.length <= 1}
            onClick={() => setIsConfirming(true)}
          >
            Delete…
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
