import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Check, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GraphQLRequestError } from "~/lib/graphql";
import { uploadImage, type ImageKind } from "~/lib/image-upload";
import { cn } from "~/lib/utils";

const MAX_BYTES = 20 * 1024 * 1024;
const stateLabelClasses = "text-[0.65rem] font-semibold uppercase tracking-[0.2em]";

type ImageUploaderProps = {
  artist: string | null;
  kind: ImageKind;
  currentUrl?: string | null;
  name?: string;
  error?: string | null;
  className?: string;
  onUploadingChange?: (isUploading: boolean) => void;
};

export function ImageUploader({
  artist,
  kind,
  currentUrl = null,
  name = "fileId",
  error,
  className,
  onUploadingChange,
}: ImageUploaderProps) {
  const id = useId();
  const controllerRef = useRef<AbortController | null>(null);
  const previewRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileId, setFileId] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isUploading = progress !== null;
  const canUpload = artist !== null && !isUploading;
  const previewUrl = localPreview ?? currentUrl;
  const message = uploadError ?? error ?? null;

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function showPreview(url: string | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setLocalPreview(url);
  }

  async function handleFile(file: File) {
    if (!artist) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose a photo file.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setUploadError("That photo is over 20 MB. Choose a smaller one.");
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setFileId("");
    setUploadError(null);
    setProgress(0);
    showPreview(URL.createObjectURL(file));
    onUploadingChange?.(true);

    try {
      const image = await uploadImage(file, {
        artist,
        kind,
        onProgress: setProgress,
        signal: controller.signal,
      });
      setFileId(image.fileId);
    } catch (err) {
      if (controller.signal.aborted) return;
      setUploadError(
        err instanceof GraphQLRequestError
          ? err.message
          : "The upload failed. Check your connection and try again.",
      );
      showPreview(null);
    } finally {
      if (controllerRef.current === controller) {
        setProgress(null);
        onUploadingChange?.(false);
      }
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = canUpload ? "copy" : "none";
    if (canUpload) setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (canUpload && file) void handleFile(file);
  }

  const pickButton = (label: string) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-none"
      disabled={!canUpload}
      onClick={() => inputRef.current?.click()}
      aria-invalid={message ? true : undefined}
      aria-describedby={`${id}-status`}
    >
      {label}
    </Button>
  );

  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative grid aspect-square place-items-center overflow-hidden border bg-surface-raised text-center",
          isDragging
            ? "border-accent bg-accent/10"
            : message
              ? "border-dashed border-destructive"
              : previewUrl
                ? "border-border"
                : "border-dashed border-border",
        )}
      >
        {previewUrl && !isDragging && (
          <img
            src={previewUrl}
            alt=""
            className={cn("absolute inset-0 size-full object-contain", isUploading && "opacity-45")}
          />
        )}

        {isDragging ? (
          <div className="grid justify-items-center gap-2.5 text-accent">
            <Upload className="size-7" strokeWidth={1.5} aria-hidden="true" />
            <p className={stateLabelClasses}>Drop to upload</p>
          </div>
        ) : isUploading ? (
          <p className={cn("relative", stateLabelClasses)}>Uploading {progress}%</p>
        ) : previewUrl ? (
          <div className="absolute right-2 bottom-2">{pickButton("Replace photo")}</div>
        ) : (
          <div className="grid justify-items-center gap-2.5 px-5">
            <Upload
              className={cn("size-7 text-muted-foreground", !artist && "opacity-50")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-sm">{artist ? "Drag a photo here" : "Choose an artist first"}</p>
            {!artist && (
              <p className="text-xs text-muted-foreground">
                Photos are saved to that artist's portfolio folder.
              </p>
            )}
            {pickButton("Choose photo")}
          </div>
        )}

        {isUploading && (
          <div
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="absolute inset-x-0 bottom-0 h-1 bg-border"
          >
            <div
              className="h-full bg-foreground transition-[width] dark:bg-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <input type="hidden" name={name} value={fileId} />

      <p id={`${id}-status`} aria-live="polite" className="text-xs text-muted-foreground">
        {message ? (
          <span className="text-destructive">{message}</span>
        ) : !artist ? (
          "Pick one in the Artist menu to upload."
        ) : isUploading ? (
          "Uploading…"
        ) : fileId ? (
          <span className="inline-flex items-center gap-1.5 text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Uploaded. Save to use this photo.
          </span>
        ) : (
          "Any photo up to 20 MB."
        )}
      </p>
    </div>
  );
}
