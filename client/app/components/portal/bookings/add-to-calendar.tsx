import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { downloadIcs, googleCalendarUrl, type CalendarEvent } from "~/lib/calendar";

const itemClasses =
  "px-3 py-2 text-left text-sm transition-colors hover:bg-surface-raised hover:text-accent";

type AddToCalendarProps = {
  event: CalendarEvent;
  filename: string;
};

export function AddToCalendar({ event, filename }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        type="button"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-none")}
      >
        <CalendarPlus className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        Add to calendar
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-56 gap-0 rounded-none border border-border bg-background p-1 shadow-lg ring-0"
      >
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          onClick={() => setIsOpen(false)}
          className={itemClasses}
        >
          Google Calendar
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={() => {
            downloadIcs(event, filename);
            setIsOpen(false);
          }}
          className={itemClasses}
        >
          Apple / Outlook (.ics)
        </button>
      </PopoverContent>
    </Popover>
  );
}
