import { requiredText, textList } from "../validate.js";

export type PieceInput = {
  fileId?: string | null;
  style: string;
  tags: string[];
};

export function cleanPieceInput(input: PieceInput) {
  return {
    style: requiredText("style", "Style", input.style, 40).toLowerCase(),
    tags: textList(
      "tags",
      "tags",
      input.tags.map((tag) => tag.toLowerCase()),
      { maxItems: 15, maxLength: 30 },
    ),
  };
}
