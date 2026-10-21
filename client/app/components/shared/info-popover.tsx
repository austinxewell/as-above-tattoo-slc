import type { ReactNode } from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/ui/popover";

type InfoPopoverProps = {
  label: string;
  title: string;
  children: ReactNode;
};

export function InfoPopover({ label, title, children }: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={label}
        className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-accent data-popup-open:text-accent"
      >
        <Info className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 max-w-[calc(100vw-2rem)] gap-2 rounded-none border border-border bg-background p-4 shadow-lg ring-0"
      >
        <PopoverTitle className="font-display text-base uppercase dark:text-accent">
          {title}
        </PopoverTitle>

        <PopoverDescription
          render={<div />}
          className="grid gap-2 text-sm leading-6 text-muted-foreground"
        >
          {children}
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
