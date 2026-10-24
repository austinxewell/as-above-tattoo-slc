const FILES_API = "https://api.imagekit.io/v1/files";
const FOLDER_API = "https://api.imagekit.io/v1/folder";

export type ArtistImageKind = "portfolio" | "profile";

export function artistFolder(slug: string, kind?: ArtistImageKind) {
  return kind ? `/artists/${slug}/${kind}` : `/artists/${slug}`;
}

type ImageKitFile = {
  fileId: string;
  filePath: string;
  url: string;
};

function authHeader() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error("IMAGEKIT_PRIVATE_KEY is not set.");

  // ImageKit's REST API uses Basic auth: the private key is the username, with no password.
  return `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
}

export async function getImageFile(fileId: string): Promise<ImageKitFile | null> {
  const res = await fetch(`${FILES_API}/${encodeURIComponent(fileId)}/details`, {
    headers: { Authorization: authHeader() },
  });

  if (res.status === 400 || res.status === 404) return null;

  if (!res.ok) throw new Error(`ImageKit file lookup failed with ${res.status}.`);

  return (await res.json()) as ImageKitFile;
}

// Best effort: a leftover file only costs storage, so a failed delete never fails the request.
export async function deleteImageFile(fileId: string) {
  try {
    const res = await fetch(`${FILES_API}/${encodeURIComponent(fileId)}`, {
      method: "DELETE",
      headers: { Authorization: authHeader() },
    });

    if (!res.ok && res.status !== 404) {
      console.error(`deleteImageFile: ImageKit returned ${res.status} for ${fileId}.`);
    }
  } catch (error) {
    console.error("deleteImageFile:", error);
  }
}

export async function deleteArtistFolder(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`deleteArtistFolder: refusing unexpected slug "${slug}".`);
    return;
  }

  try {
    const res = await fetch(FOLDER_API, {
      method: "DELETE",
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ folderPath: artistFolder(slug) }),
    });

    if (!res.ok && res.status !== 404) {
      console.error(`deleteArtistFolder: ImageKit returned ${res.status} for ${slug}.`);
    }
  } catch (error) {
    console.error("deleteArtistFolder:", error);
  }
}
