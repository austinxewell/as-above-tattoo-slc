import { GraphQLError } from "graphql";

type ArtistBookingInput = {
  minimum: string;
  rate: string;
  deposit: string;
  availability: string;
  notes: string[];
};

export type ArtistUpdateInput = {
  name?: string | null;
  bio?: string | null;
  statement?: string | null;
  specialties?: string[] | null;
  instagram?: string | null;
  imgUrl?: string | null;
  isBooking?: boolean | null;
  booking?: ArtistBookingInput | null;
};

type ArtistChanges = {
  name?: string;
  bio?: string;
  statement?: string;
  specialties?: string[];
  instagram?: string | undefined;
  imgUrl?: string;
  isBooking?: boolean;
  booking?: ArtistBookingInput;
};

function invalid(field: string, message: string): never {
  throw new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT", field } });
}

function requiredText(field: string, label: string, value: string | null | undefined, max: number) {
  const text = (value ?? "").trim();
  if (!text) invalid(field, `${label} can't be empty.`);
  if (text.length > max) invalid(field, `${label} must be ${max} characters or fewer.`);
  return text;
}

function textList(
  field: string,
  label: string,
  values: string[] | null | undefined,
  { maxItems, maxLength }: { maxItems: number; maxLength: number },
) {
  const items = [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];

  if (items.length > maxItems) invalid(field, `You can add up to ${maxItems} ${label}.`);
  if (items.some((item) => item.length > maxLength)) {
    invalid(field, `Each of the ${label} must be ${maxLength} characters or fewer.`);
  }

  return items;
}

function imageUrl(value: string | null | undefined) {
  const text = requiredText("imgUrl", "Photo address", value, 2048);

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    invalid("imgUrl", "Enter a full web address, starting with https://.");
  }

  if (url.protocol !== "https:") invalid("imgUrl", "The photo address must start with https://.");
  return url.toString();
}

function instagramHandle(value: string | null | undefined) {
  const handle = (value ?? "").trim().replace(/^@/, "");
  if (!handle) return undefined;

  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
    invalid("instagram", "Use just your handle: letters, numbers, dots and underscores.");
  }

  return handle;
}

export function cleanArtistInput(input: ArtistUpdateInput): ArtistChanges {
  const changes: ArtistChanges = {};

  if ("name" in input) changes.name = requiredText("name", "Name", input.name, 60);
  if ("bio" in input) changes.bio = requiredText("bio", "Bio", input.bio, 1500);
  if ("statement" in input) {
    changes.statement = requiredText("statement", "Statement", input.statement, 400);
  }
  if ("specialties" in input) {
    changes.specialties = textList("specialties", "specialties", input.specialties, {
      maxItems: 10,
      maxLength: 40,
    });
  }
  if ("instagram" in input) changes.instagram = instagramHandle(input.instagram);
  if ("imgUrl" in input) changes.imgUrl = imageUrl(input.imgUrl);

  if ("isBooking" in input) {
    if (typeof input.isBooking !== "boolean") invalid("isBooking", "Choose open or closed.");
    changes.isBooking = input.isBooking;
  }

  if ("booking" in input) {
    const booking = input.booking;
    if (!booking) invalid("booking", "Booking details can't be empty.");

    changes.booking = {
      minimum: requiredText("booking.minimum", "Minimum", booking.minimum, 80),
      rate: requiredText("booking.rate", "Rate", booking.rate, 80),
      deposit: requiredText("booking.deposit", "Deposit", booking.deposit, 80),
      availability: requiredText("booking.availability", "Availability", booking.availability, 80),
      notes: textList("booking.notes", "notes", booking.notes, { maxItems: 8, maxLength: 200 }),
    };
  }

  return changes;
}
