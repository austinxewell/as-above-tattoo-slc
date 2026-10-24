export function sizedImage(url: string, width: number) {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "ik.imagekit.io") return url;

    parsed.searchParams.set("tr", `w-${width}`);
    return parsed.toString();
  } catch {
    return url;
  }
}
