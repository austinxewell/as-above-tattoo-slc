import { SheetTrigger } from "~/components/ui/sheet";

type MenuTriggerProps = {
  label: string;
};

export function MenuTrigger({ label }: MenuTriggerProps) {
  return (
    <SheetTrigger
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-transparent text-foreground transition-colors hover:bg-surface-raised hover:text-accent-hover"
    >
      <span className="text-xl" aria-hidden="true">
        ☰
      </span>
    </SheetTrigger>
  );
}
