import { invalid, requiredText } from "../validate.js";

export type AboutInput = {
  heading?: string | null;
  body?: string | null;
  values?: { title: string; description: string }[] | null;
};

const MAX_VALUES = 8;

export function cleanAboutInput(input: AboutInput) {
  const changes: {
    heading?: string;
    body?: string;
    values?: { title: string; description: string }[];
  } = {};

  if ("heading" in input) changes.heading = requiredText("heading", "Heading", input.heading, 80);
  if ("body" in input) changes.body = requiredText("body", "Body", input.body, 1500);

  if ("values" in input) {
    const values = input.values ?? [];
    if (values.length > MAX_VALUES) invalid("values", `You can add up to ${MAX_VALUES} values.`);

    changes.values = values.map((value) => ({
      title: requiredText("values", "Each value's title", value.title, 40),
      description: requiredText("values", "Each value's description", value.description, 300),
    }));
  }

  return changes;
}
