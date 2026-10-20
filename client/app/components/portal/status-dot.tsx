import { cn } from "~/lib/utils";

export type StatusTone = "success" | "accent" | "muted";

export function StatusDot({ tone, children }: { tone: StatusTone; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm",
        tone === "success" && "text-success",
        tone === "accent" && "text-accent",
        tone === "muted" && "text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          tone === "success" && "bg-success",
          tone === "accent" && "bg-accent",
          tone === "muted" && "border border-muted-foreground",
        )}
      />
      {children}
    </span>
  );
}
