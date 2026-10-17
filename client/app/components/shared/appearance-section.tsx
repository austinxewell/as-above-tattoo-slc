import { ThemeToggle } from "~/components/theme-toggle";

export function AppearanceSection() {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Appearance
      </p>
      <ThemeToggle showLabel />
    </div>
  );
}
