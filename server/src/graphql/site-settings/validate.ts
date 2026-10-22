import { weekdays, type ShopDetails } from "../../models/site-settings.js";
import { invalid, requiredText } from "../validate.js";

type Weekday = ShopDetails["hours"][number]["day"];
type HoursInput = {
  day: Weekday;
  isOpen: boolean;
  opensAt?: string | null;
  closesAt?: string | null;
};

type TextField = "street" | "city" | "state" | "zip" | "phone" | "email" | "instagram" | "facebook";

export type ShopDetailsInput = Partial<Record<TextField, string | null>> & {
  hours?: HoursInput[] | null;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const dayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function cleanPhone(value: string | null | undefined) {
  const digits = (value ?? "").replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (local.length !== 10) invalid("phone", "Enter a 10-digit phone number.");
  return `+1${local}`;
}

function cleanEmail(value: string | null | undefined) {
  const email = (value ?? "").trim().toLowerCase();

  if (email.length > 254 || (email && !/^\S+@\S+\.\S+$/.test(email))) {
    invalid("email", "Enter a valid email address, or leave it empty.");
  }
  return email;
}

function cleanHandle(field: string, label: string, value: string | null | undefined) {
  const handle = requiredText(field, label, value, 100)
    .replace(/^https?:\/\/(www\.)?(instagram|facebook)\.com\//i, "")
    .replace(/^@+/, "")
    .replace(/\/+$/, "");

  if (!/^[A-Za-z0-9._-]{1,60}$/.test(handle)) {
    invalid(field, `${label} can only use letters, numbers, dots, dashes and underscores.`);
  }
  return handle;
}

function cleanHours(hours: HoursInput[]) {
  if (hours.length !== 7 || weekdays.some((day, index) => hours[index].day !== day)) {
    invalid("hours", "Send all seven days, Monday to Sunday.");
  }

  return hours.map(({ day, isOpen, opensAt, closesAt }) => {
    const validOpens = opensAt && timePattern.test(opensAt) ? opensAt : undefined;
    const validCloses = closesAt && timePattern.test(closesAt) ? closesAt : undefined;

    if (isOpen) {
      if (!validOpens || !validCloses) {
        invalid("hours", `${dayLabels[day]} needs an opening and closing time.`);
      }
      if (validCloses <= validOpens) {
        invalid("hours", `${dayLabels[day]} has to close after it opens.`);
      }
    }

    return { day, isOpen, opensAt: validOpens, closesAt: validCloses };
  });
}

// Only the fields present in the input are returned, so one edit row saves one field.
export function cleanShopInput(input: ShopDetailsInput) {
  const changes: Record<string, unknown> = {};

  if ("street" in input) {
    changes.street = requiredText("street", "Street address", input.street, 100);
  }
  if ("city" in input) changes.city = requiredText("city", "City", input.city, 60);
  if ("state" in input) {
    const state = requiredText("state", "State", input.state, 2).toUpperCase();
    if (!/^[A-Z]{2}$/.test(state)) invalid("state", "Use the two-letter state code, like UT.");
    changes.state = state;
  }
  if ("zip" in input) {
    const zip = requiredText("zip", "ZIP code", input.zip, 10);
    if (!/^\d{5}(-\d{4})?$/.test(zip)) invalid("zip", "Enter a 5-digit ZIP code.");
    changes.zip = zip;
  }
  if ("phone" in input) changes.phone = cleanPhone(input.phone);
  if ("email" in input) changes.email = cleanEmail(input.email);
  if ("instagram" in input) {
    changes.instagram = cleanHandle("instagram", "Instagram handle", input.instagram);
  }
  if ("facebook" in input) {
    changes.facebook = cleanHandle("facebook", "Facebook page", input.facebook);
  }
  if (input.hours) changes.hours = cleanHours(input.hours);

  return changes;
}
