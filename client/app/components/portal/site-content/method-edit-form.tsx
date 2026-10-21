import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import type { MethodInput } from "~/lib/after-care";

type EditableStep = { id: string; value: string };
type EditableStage = { id: string; timeframe: string; title: string; steps: EditableStep[] };

const iconButtonClasses =
  "grid size-8 shrink-0 place-items-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

const removeClasses = cn(iconButtonClasses, "hover:border-destructive hover:text-destructive");

const labelClasses = "text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground";

function swap<T>(list: T[], index: number, offset: -1 | 1) {
  const next = [...list];
  [next[index], next[index + offset]] = [next[index + offset], next[index]];
  return next;
}

function toEditableStages(method: MethodInput | null): EditableStage[] {
  return (method?.stages ?? []).map((stage) => ({
    id: crypto.randomUUID(),
    timeframe: stage.timeframe,
    title: stage.title,
    steps: stage.steps.map((value) => ({ id: crypto.randomUUID(), value })),
  }));
}

type MethodEditFormProps = {
  methods: MethodInput[];
  index: number | null;
  onClose: () => void;
};

export function MethodEditForm({ methods, index, onClose }: MethodEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const current = index === null ? null : methods[index];
  const [name, setName] = useState(current?.name ?? "");
  const [description, setDescription] = useState(current?.description ?? "");
  const [stages, setStages] = useState(() => toEditableStages(current));
  const id = useId();
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  const edited: MethodInput = {
    slug: current?.slug,
    name,
    description,
    stages: stages.map((stage) => ({
      timeframe: stage.timeframe,
      title: stage.title,
      steps: stage.steps.map((step) => step.value),
    })),
  };

  // The server replaces the whole list, so send every method with this one swapped in.
  const nextMethods =
    index === null
      ? [...methods, edited]
      : methods.map((method, i) => (i === index ? edited : method));

  function updateStage(stageId: string, changes: Partial<EditableStage>) {
    setStages((list) =>
      list.map((stage) => (stage.id === stageId ? { ...stage, ...changes } : stage)),
    );
  }

  function updateSteps(stageId: string, change: (steps: EditableStep[]) => EditableStep[]) {
    setStages((list) =>
      list.map((stage) =>
        stage.id === stageId ? { ...stage, steps: change(stage.steps) } : stage,
      ),
    );
  }

  return (
    <fetcher.Form
      method="post"
      aria-label={current ? `Edit ${current.name}` : "New healing method"}
      className="grid gap-5"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="methods" />
      <input type="hidden" name="methods" value={JSON.stringify(nextMethods)} />

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-name`} className={labelClasses}>
          Method name
        </label>
        <input
          id={`${id}-name`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          placeholder="e.g. Standard wrap"
          autoFocus
          className={controlClasses}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-description`} className={labelClasses}>
          Description
        </label>
        <textarea
          id={`${id}-description`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={300}
          rows={2}
          placeholder="One or two sentences about this method"
          className={cn(controlClasses, "resize-y")}
        />
      </div>

      <div className="grid gap-3">
        <p className={labelClasses}>Healing stages</p>

        <ol className="grid gap-4">
          {stages.map((stage, stageIndex) => {
            const stageLabel = `Stage ${stageIndex + 1}`;

            return (
              <li key={stage.id} className="grid gap-3 border border-border bg-surface-raised p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className={labelClasses}>{stageLabel}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStages((list) => swap(list, stageIndex, -1))}
                      disabled={stageIndex === 0}
                      aria-label={`Move ${stageLabel} up`}
                      className={iconButtonClasses}
                    >
                      <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStages((list) => swap(list, stageIndex, 1))}
                      disabled={stageIndex === stages.length - 1}
                      aria-label={`Move ${stageLabel} down`}
                      className={iconButtonClasses}
                    >
                      <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStages((list) => list.filter((item) => item.id !== stage.id))
                      }
                      aria-label={`Remove ${stageLabel}`}
                      className={removeClasses}
                    >
                      <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <input
                    type="text"
                    value={stage.timeframe}
                    onChange={(event) => updateStage(stage.id, { timeframe: event.target.value })}
                    maxLength={40}
                    placeholder="When, e.g. Days 1–3"
                    aria-label={`${stageLabel} timeframe`}
                    className={controlClasses}
                  />
                  <input
                    type="text"
                    value={stage.title}
                    onChange={(event) => updateStage(stage.id, { title: event.target.value })}
                    maxLength={60}
                    placeholder="Title, e.g. Wash and protect"
                    aria-label={`${stageLabel} title`}
                    className={controlClasses}
                  />
                </div>

                <ul className="grid gap-2">
                  {stage.steps.map((step, stepIndex) => {
                    const stepLabel = `${stageLabel} step ${stepIndex + 1}`;

                    return (
                      <li key={step.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={step.value}
                          onChange={(event) =>
                            updateSteps(stage.id, (steps) =>
                              steps.map((item) =>
                                item.id === step.id ? { ...item, value: event.target.value } : item,
                              ),
                            )
                          }
                          maxLength={200}
                          placeholder="One instruction"
                          aria-label={stepLabel}
                          className={cn(controlClasses, "min-w-0 flex-1")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateSteps(stage.id, (steps) => swap(steps, stepIndex, -1))
                          }
                          disabled={stepIndex === 0}
                          aria-label={`Move ${stepLabel} up`}
                          className={iconButtonClasses}
                        >
                          <ArrowUp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSteps(stage.id, (steps) => swap(steps, stepIndex, 1))
                          }
                          disabled={stepIndex === stage.steps.length - 1}
                          aria-label={`Move ${stepLabel} down`}
                          className={iconButtonClasses}
                        >
                          <ArrowDown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSteps(stage.id, (steps) =>
                              steps.filter((item) => item.id !== step.id),
                            )
                          }
                          aria-label={`Remove ${stepLabel}`}
                          className={removeClasses}
                        >
                          <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    updateSteps(stage.id, (steps) => [
                      ...steps,
                      { id: crypto.randomUUID(), value: "" },
                    ])
                  }
                  disabled={stage.steps.length >= 8}
                  className="inline-flex w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
                >
                  <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                  Add step
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() =>
            setStages((list) => [
              ...list,
              { id: crypto.randomUUID(), timeframe: "", title: "", steps: [] },
            ])
          }
          disabled={stages.length >= 8}
          className="inline-flex w-fit items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-accent disabled:text-muted-foreground"
        >
          <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          Add stage
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            "Up to 8 stages, each with up to 8 steps."
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
