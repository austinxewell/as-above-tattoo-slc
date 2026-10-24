import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ImageUploader } from "~/components/shared/image-uploader";
import { sizedImage } from "~/lib/image-url";

type PhotoEditFormProps = {
  slug: string;
  currentUrl: string;
  onClose: () => void;
};

export function PhotoEditForm({ slug, currentUrl, onClose }: PhotoEditFormProps) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const [isUploading, setIsUploading] = useState(false);
  const isSaving = fetcher.state !== "idle";
  const error = !isSaving && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onClose();
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <fetcher.Form
      method="post"
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <input type="hidden" name="intent" value="photo" />

      <ImageUploader
        artist={slug}
        kind="PROFILE"
        currentUrl={currentUrl ? sizedImage(currentUrl, 600) : null}
        error={error}
        onUploadingChange={setIsUploading}
        className="w-full max-w-56"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="brand" size="sm" disabled={isSaving || isUploading}>
          {isSaving ? "Saving" : "Save"}
          {isSaving && (
            <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.5} aria-hidden="true" />
          )}
        </Button>
      </div>
    </fetcher.Form>
  );
}
