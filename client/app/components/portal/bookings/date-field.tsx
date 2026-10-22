import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";

const dayFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

type DateFieldProps = {
  id: string;
  name: string;
};

// Submits the chosen day as YYYY-MM-DD in local time, like <input type="date">.
export function DateField({ id, name }: DateFieldProps) {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [today] = useState(startOfToday);

  return (
    <>
      <input type="hidden" name={name} value={date ? date.toLocaleDateString("en-CA") : ""} />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          id={id}
          type="button"
          className={cn(
            controlClasses,
            "flex items-center justify-between gap-3 text-left data-popup-open:border-accent",
            !date && "text-muted-foreground",
          )}
        >
          {date ? dayFormat.format(date) : "Choose a date"}
          <CalendarDays
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto gap-0 rounded-none border border-border bg-background p-2 shadow-lg ring-0"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => {
              setDate(day);
              setIsOpen(false);
            }}
            disabled={{ before: today }}
            startMonth={today}
            defaultMonth={date ?? today}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
