import { GraphQLError } from "graphql";

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

export function imageUrl(value: string | null | undefined) {
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
