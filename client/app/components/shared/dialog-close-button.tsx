import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { DialogClose } from "~/components/ui/dialog";

export function DialogCloseButton({ className }: { className?: string }) {
  return (
    <DialogClose
      aria-label="Close"
      className={cn(
        "absolute top-5 right-5 inline-flex size-9 items-center justify-center border border-border bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <X className="size-4" aria-hidden="true" />
    </DialogClose>
  );
}
