import { useId } from "react";
import { Minus, Plus } from "lucide-react";

type NumberStepperProps = {
  name: string;
  label: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const buttonClasses =
  "grid size-9 place-items-center transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-35";

export function NumberStepper({ name, label, max, value, onChange }: NumberStepperProps) {
  const id = useId();
  const change = (next: number) => onChange(Math.min(max, Math.max(0, next)));

  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <label htmlFor={`${id}-input`} className="block font-medium">
          {label}
        </label>
        <span id={`${id}-help`} className="block text-sm text-muted-foreground">
          Minimum number. 0 means not required. Up to {max}.
        </span>
      </div>

      <div className="flex shrink-0 border border-border bg-background">
        <button
          type="button"
          onClick={() => change(value - 1)}
          disabled={value <= 0}
          aria-label={`Fewer ${label.toLowerCase()}`}
          className={buttonClasses}
        >
          <Minus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <input
          id={`${id}-input`}
          name={name}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(event) => change(Number(event.target.value) || 0)}
          aria-describedby={`${id}-help`}
          className="w-12 border-x border-border bg-transparent text-center font-medium tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => change(value + 1)}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
          className={buttonClasses}
        >
          <Plus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
