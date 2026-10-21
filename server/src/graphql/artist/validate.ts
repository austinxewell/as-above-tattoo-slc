import { imageUrl, invalid, requiredText, textList } from "../validate.js";

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
