import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import { InfoPopover } from "~/components/shared/info-popover";

type TagListInputProps = {
  name: string;
  initialTags: string[];
  error: string | null;
  max?: number;
  maxLength?: number;
};

export function TagListInput({
  name,
  initialTags,
  error,
  max = 15,
  maxLength = 30,
}: TagListInputProps) {
  const [tags, setTags] = useState(initialTags);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const isFull = tags.length >= max;

  function add() {
    const tag = draft.trim();
    if (tag && !tags.includes(tag) && !isFull) setTags([...tags, tag]);
    setDraft("");
    inputRef.current?.focus();
  }

  function remove(tag: string) {
    setTags(tags.filter((current) => current !== tag));
    inputRef.current?.focus();
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-1">
        <label
          htmlFor={`${id}-input`}
          className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Tags
        </label>

        <InfoPopover label="About tags" title="About tags">
          <p>
            Tags aren't shown on the site. They only help people find this piece when they search
            the portfolio.
          </p>
          <p className="text-foreground dark:text-accent">Good tags describe:</p>
          <ul className="list-disc space-y-0.5 pl-5">
            <li>Where it is: forearm, calf, ribs</li>
            <li>What it shows: moth, rose, portrait</li>
            <li>How it looks: black and grey, color</li>
          </ul>
          <p className="font-bold">
            Use the words a client would type, and skip the style, which is already searchable.
          </p>
        </InfoPopover>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value.toLowerCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          maxLength={maxLength}
          disabled={isFull}
          placeholder="forearm"
          autoCapitalize="none"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-help`}
          className={controlClasses}
        />
        <Button
          type="button"
          variant="outline"
          className="h-auto shrink-0 rounded-none"
          onClick={add}
          disabled={isFull || !draft.trim()}
        >
          Add
        </Button>
      </div>

      {tags.length > 0 && (
        <ul aria-label="Tags added" className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-0.5 border border-border bg-surface py-0.5 pr-0.5 pl-2.5 text-sm"
            >
              {tag}
              <input type="hidden" name={name} value={tag} />
              <button
                type="button"
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
                className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {draft.trim() && <input type="hidden" name={name} value={draft.trim()} />}

      <p id={`${id}-help`} className="text-xs text-muted-foreground">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          <>
            Press Enter after each one.{" "}
            <span className="tabular-nums">
              {tags.length} of {max}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
