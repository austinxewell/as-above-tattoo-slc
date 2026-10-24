import { upload } from "@imagekit/javascript";
import { graphqlRequest } from "~/lib/graphql";

const CREATE_IMAGE_UPLOAD_MUTATION = /* GraphQL */ `
  mutation CreateImageUpload($artist: String!, $kind: ImageKind!) {
    createImageUpload(artist: $artist, kind: $kind) {
      token
      expire
      signature
      publicKey
      folder
    }
  }
`;

export type ImageKind = "PORTFOLIO" | "PROFILE";

type ImageUploadAuth = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  folder: string;
};

export type UploadedImage = { fileId: string; url: string };

type UploadImageOptions = {
  artist: string;
  kind: ImageKind;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

export async function uploadImage(
  file: File,
  { artist, kind, onProgress, signal }: UploadImageOptions,
): Promise<UploadedImage> {
  const { createImageUpload: auth } = await graphqlRequest<{ createImageUpload: ImageUploadAuth }>(
    CREATE_IMAGE_UPLOAD_MUTATION,
    { artist, kind },
    signal,
  );

  const result = await upload({
    file,
    fileName: file.name,
    token: auth.token,
    expire: auth.expire,
    signature: auth.signature,
    publicKey: auth.publicKey,
    folder: auth.folder,
    abortSignal: signal,
    onProgress: (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });

  if (!result.fileId || !result.url) {
    throw new Error("The upload didn't finish. Please try again.");
  }

  return { fileId: result.fileId, url: result.url };
}
