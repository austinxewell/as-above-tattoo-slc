import type { RemovalScope } from "./removal-summary";

type RemovalScopeProps = {
  firstName: string;
  value: RemovalScope;
  onChange: (scope: RemovalScope) => void;
};

const cardClasses =
  "grid cursor-pointer grid-cols-[auto_1fr] gap-x-3 gap-y-1 border border-border bg-surface p-4 transition-colors has-[:checked]:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring";

export function RemovalScopePicker({ firstName, value, onChange }: RemovalScopeProps) {
  const options: { value: RemovalScope; label: string; description: string }[] = [
    {
      value: "profile",
      label: "Only the artist profile",
      description: `${firstName} keeps their admin login. Their artist page and portfolio are removed.`,
    },
    {
      value: "person",
      label: `${firstName} entirely`,
      description: "Removes the login too. They're signed out everywhere.",
    },
  ];

  return (
    <fieldset>
      <legend className="sr-only">What to remove</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.value} className={cardClasses}>
            <input
              type="radio"
              name="scope"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 size-4 accent-accent focus-visible:outline-none"
            />
            <span className="font-medium">{option.label}</span>
            <span className="col-start-2 text-sm text-muted-foreground">{option.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
