import type { Types } from "mongoose";
import { PieceModel } from "../../models/piece.js";
import type { Artist } from "../../models/artist.js";
import type { PublishingStandards } from "../../models/site-settings.js";

export type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
  detail: string | null;
  current?: number;
  goal?: number;
};

type ChecklistArtist = Pick<
  Artist,
  "imgUrl" | "bio" | "statement" | "instagram" | "specialties" | "booking"
> & {
  _id: Types.ObjectId;
};

export async function publishChecklist(
  artist: ChecklistArtist,
  standards: PublishingStandards,
): Promise<ChecklistItem[]> {
  const items: ChecklistItem[] = [];
  const booking = artist.booking;

  if (standards.photo) {
    items.push({
      key: "photo",
      label: "Profile photo",
      done: Boolean(artist.imgUrl),
      detail: null,
    });
  }

  if (standards.bio) {
    items.push({ key: "bio", label: "Bio", done: Boolean(artist.bio), detail: null });
  }

  if (standards.statement) {
    items.push({
      key: "statement",
      label: "Statement",
      done: Boolean(artist.statement),
      detail: null,
    });
  }

  if (standards.instagram) {
    items.push({
      key: "instagram",
      label: "Instagram handle",
      done: Boolean(artist.instagram),
      detail: null,
    });
  }

  if (standards.minSpecialties > 0) {
    const count = artist.specialties.length;
    items.push({
      key: "specialties",
      label:
        standards.minSpecialties === 1 ? "1 specialty" : `${standards.minSpecialties} specialties`,
      done: count >= standards.minSpecialties,
      detail: `${Math.min(count, standards.minSpecialties)} of ${standards.minSpecialties}`,
      current: count,
      goal: standards.minSpecialties,
    });
  }

  if (standards.booking) {
    const hasBooking = [
      booking?.minimum,
      booking?.rate,
      booking?.deposit,
      booking?.availability,
    ].every(Boolean);

    items.push({
      key: "booking",
      label: "Booking details",
      done: hasBooking,
      detail: hasBooking ? null : "Minimum, rate, deposit and availability",
    });
  }

  if (standards.minPieces > 0) {
    const count = await PieceModel.countDocuments({ artist: artist._id });
    items.push({
      key: "pieces",
      label:
        standards.minPieces === 1 ? "1 portfolio piece" : `${standards.minPieces} portfolio pieces`,
      done: count >= standards.minPieces,
      detail: `${Math.min(count, standards.minPieces)} of ${standards.minPieces}`,
      current: count,
      goal: standards.minPieces,
    });
  }

  return items;
}

export function isReadyToPublish(checklist: ChecklistItem[]) {
  return checklist.every((item) => item.done);
}
