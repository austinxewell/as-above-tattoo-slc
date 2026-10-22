import { useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const triggerClasses =
  "w-[4.75rem] rounded-none border-border bg-background px-3 py-2.5 text-base tabular-nums data-[size=default]:h-auto dark:bg-background dark:hover:bg-background focus-visible:border-accent focus-visible:ring-0";
const contentClasses = "rounded-none border border-border bg-background ring-0";

const hourItems = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));
const minuteItems = ["00", "15", "30", "45"].map((minute) => ({ value: minute, label: minute }));
const periods = ["AM", "PM"] as const;
type Period = (typeof periods)[number];

function toTimeValue(hour: string, minute: string, period: Period) {
  const hours = (Number(hour) % 12) + (period === "PM" ? 12 : 0);
  return `${String(hours).padStart(2, "0")}:${minute}`;
}

function fromTimeValue(value: string | undefined) {
  const match = value?.match(/^(\d{2}):(\d{2})$/);
  if (!match) return { hour: null, minute: "00", period: "PM" as Period };

  const hours = Number(match[1]);
  return {
    hour: String(hours % 12 || 12),
    minute: match[2],
    period: (hours < 12 ? "AM" : "PM") as Period,
  };
}

type TimeFieldProps = {
  name: string;
  legend: string;
  legendClassName?: string;
  defaultValue?: string;
};

// Submits the time as 24-hour HH:MM, like <input type="time">. Empty until an hour is chosen.
export function TimeField({ name, legend, legendClassName, defaultValue }: TimeFieldProps) {
  const id = useId();
  const [initial] = useState(() => fromTimeValue(defaultValue));
  const [hour, setHour] = useState<string | null>(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);

  return (
    <fieldset>
      <legend className={legendClassName}>{legend}</legend>
      <input type="hidden" name={name} value={hour ? toTimeValue(hour, minute, period) : ""} />

      <div className="mt-2 flex flex-wrap items-stretch gap-2">
        <Select
          items={hourItems}
          value={hour}
          onValueChange={(value) => setHour(typeof value === "string" ? value : null)}
        >
          <SelectTrigger aria-label="Hour" className={triggerClasses}>
            <SelectValue placeholder="--" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className={contentClasses}>
            {hourItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span aria-hidden="true" className="self-center text-muted-foreground">
          :
        </span>

        <Select
          items={minuteItems}
          value={minute}
          onValueChange={(value) => {
            if (typeof value === "string") setMinute(value);
          }}
        >
          <SelectTrigger aria-label="Minute" className={triggerClasses}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className={contentClasses}>
            {minuteItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-1 grid grid-cols-2 border border-border bg-background">
          {periods.map((option) => (
            <label key={option} className="flex cursor-pointer">
              <input
                type="radio"
                name={`${id}-period`}
                value={option}
                checked={period === option}
                onChange={() => setPeriod(option)}
                className="peer sr-only"
              />
              <span className="grid place-items-center px-3 text-sm transition-colors hover:text-accent peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
