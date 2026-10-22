import { graphqlRequest } from "~/lib/graphql";

export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof weekdays)[number];

export type ShopHours = {
  day: Weekday;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
};

export type ShopDetails = {
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string | null;
  instagram: string;
  facebook: string;
  hours: ShopHours[];
};

export const SHOP_DETAILS_FIELDS = /* GraphQL */ `
  fragment ShopDetailsFields on ShopDetails {
    street
    city
    state
    zip
    phone
    email
    instagram
    facebook
    hours {
      day
      isOpen
      opensAt
      closesAt
    }
  }
`;

const SHOP_DETAILS_QUERY = /* GraphQL */ `
  query ShopDetails {
    shopDetails {
      ...ShopDetailsFields
    }
  }
  ${SHOP_DETAILS_FIELDS}
`;

const UPDATE_SHOP_DETAILS_MUTATION = /* GraphQL */ `
  mutation UpdateShopDetails($input: ShopDetailsInput!) {
    updateShopDetails(input: $input) {
      ...ShopDetailsFields
    }
  }
  ${SHOP_DETAILS_FIELDS}
`;

export async function fetchShopDetails(signal?: AbortSignal) {
  const { shopDetails } = await graphqlRequest<{ shopDetails: ShopDetails }>(
    SHOP_DETAILS_QUERY,
    undefined,
    signal,
  );
  return shopDetails;
}

const singleFields = ["phone", "email", "instagram", "facebook"] as const;

function readInput(intent: string, formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");

  if (intent === "address") {
    return { street: text("street"), city: text("city"), state: text("state"), zip: text("zip") };
  }

  if (singleFields.includes(intent as (typeof singleFields)[number])) {
    return { [intent]: text("value") };
  }

  if (intent === "hours") {
    return {
      hours: weekdays.map((day) => ({
        day,
        isOpen: formData.get(`${day}-open`) === "on",
        opensAt: text(`${day}-opensAt`) || null,
        closesAt: text(`${day}-closesAt`) || null,
      })),
    };
  }

  return null;
}

export async function handleShopAction(request: Request) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const input = readInput(intent, formData);

  if (!input) return { intent, ok: false, error: "That change isn't supported." };

  try {
    await graphqlRequest(UPDATE_SHOP_DETAILS_MUTATION, { input }, request.signal);
    return { intent, ok: true, error: null };
  } catch (error) {
    return {
      intent,
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }
}

const SHOP_NAME = "As Above Tattoo";
const SHOP_TIME_ZONE = "America/Denver";

export const dayLabels: Record<Weekday, { short: string; long: string }> = {
  monday: { short: "Mon", long: "Monday" },
  tuesday: { short: "Tue", long: "Tuesday" },
  wednesday: { short: "Wed", long: "Wednesday" },
  thursday: { short: "Thu", long: "Thursday" },
  friday: { short: "Fri", long: "Friday" },
  saturday: { short: "Sat", long: "Saturday" },
  sunday: { short: "Sun", long: "Sunday" },
};

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function addressLines(shop: ShopDetails) {
  return [shop.street, `${shop.city}, ${shop.state} ${shop.zip}`];
}

export function fullAddress(shop: ShopDetails) {
  return `${SHOP_NAME}, ${addressLines(shop).join(", ")}`;
}

export function mapsUrl(shop: ShopDetails) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(shop))}`;
}

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;
export const facebookUrl = (page: string) => `https://www.facebook.com/${page}`;

function toParts(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return { hour: hours % 12 || 12, minutes, period: hours < 12 ? "AM" : "PM" };
}

function formatClock(time: string) {
  const { hour, minutes } = toParts(time);
  return minutes ? `${hour}:${String(minutes).padStart(2, "0")}` : String(hour);
}

// "12–8 PM" when both ends share AM/PM, "10:30 AM–8 PM" when they don't.
export function formatHours({ isOpen, opensAt, closesAt }: ShopHours) {
  if (!isOpen) return "Closed";

  const opens = toParts(opensAt);
  const closes = toParts(closesAt);
  const start =
    opens.period === closes.period
      ? formatClock(opensAt)
      : `${formatClock(opensAt)} ${opens.period}`;

  return `${start}–${formatClock(closesAt)} ${closes.period}`;
}

// Joins neighbouring days with the same hours, e.g. "Mon–Fri 12–8 PM", "Sun Closed".
export function groupHours(hours: ShopHours[]) {
  const groups: { first: ShopHours; last: ShopHours }[] = [];

  for (const entry of hours) {
    const current = groups.at(-1);

    if (current && formatHours(current.first) === formatHours(entry)) current.last = entry;
    else groups.push({ first: entry, last: entry });
  }

  return groups.map(({ first, last }) => ({
    days:
      first.day === last.day
        ? dayLabels[first.day].short
        : `${dayLabels[first.day].short}–${dayLabels[last.day].short}`,
    hours: formatHours(first),
  }));
}

// The shop's today, not the visitor's, so someone in another time zone still sees Salt Lake's day.
export function todaysHours(hours: ShopHours[], now = new Date()) {
  const day = now
    .toLocaleDateString("en-US", { weekday: "long", timeZone: SHOP_TIME_ZONE })
    .toLowerCase();

  return hours.find((entry) => entry.day === day) ?? null;
}
