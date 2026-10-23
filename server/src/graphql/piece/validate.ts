import { getImageFile } from "../../images/imagekit.js";
import { invalid, requiredText, textList } from "../validate.js";

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

// Looks the upload up on ImageKit, so the URL and the folder come from ImageKit, not the client.
export async function portfolioImage(artistSlug: string, fileId: string) {
  const file = await getImageFile(fileId.trim());

  if (!file || !file.filePath.startsWith(`/artists/${artistSlug}/portfolio/`)) {
    invalid("fileId", "That photo upload wasn't found. Please upload it again.");
  }

  return { imgUrl: file.url, fileId: file.fileId };
}
