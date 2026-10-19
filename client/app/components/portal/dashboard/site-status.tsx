import { cn } from "~/lib/utils";

export function SiteStatus({ bookingRequestsEnabled }: { bookingRequestsEnabled: boolean }) {
  return (
    <div>
      <p className="inline-flex items-center gap-2.5 border border-border px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em]">
        <span
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full ring-3",
            bookingRequestsEnabled
              ? "bg-success ring-success/20"
              : "bg-destructive ring-destructive/20",
          )}
        />
        Online booking is {bookingRequestsEnabled ? "on" : "off"}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {bookingRequestsEnabled
          ? "Clients can send requests from the booking page."
          : "Clients can't send booking requests online yet."}
      </p>
    </div>
  );
}
