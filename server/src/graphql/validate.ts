import { GraphQLError } from "graphql";
import { artistFolder, getImageFile, type ArtistImageKind } from "../images/imagekit.js";

export function invalid(field: string, message: string): never {
  throw new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT", field } });
}

export function requiredText(
  field: string,
  label: string,
  value: string | null | undefined,
  max: number,
) {
  const text = (value ?? "").trim();
  if (!text) invalid(field, `${label} can't be empty.`);
  if (text.length > max) invalid(field, `${label} must be ${max} characters or fewer.`);
  return text;
}

export function textList(
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

// Looks the upload up on ImageKit, so the URL and the folder come from ImageKit, not the client.
export async function artistImage(slug: string, kind: ArtistImageKind, fileId: string) {
  const file = await getImageFile(fileId.trim());

  if (!file || !file.filePath.startsWith(`${artistFolder(slug, kind)}/`)) {
    invalid("fileId", "That photo upload wasn't found. Please upload it again.");
  }

  return { imgUrl: file.url, fileId: file.fileId };
}
