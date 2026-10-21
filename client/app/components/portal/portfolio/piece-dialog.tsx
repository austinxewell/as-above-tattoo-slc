import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";
import type { ManagedPiece, PortfolioActionResult } from "~/lib/portfolio";
import { TagListInput } from "./tag-list-input";
import { DialogCloseButton } from "~/components/shared/dialog-close-button";

const labelClasses = "text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground";
const fieldNames = ["artist", "imgUrl", "style", "tags"];

export type PieceTarget = ManagedPiece | "new" | null;

type ArtistOption = { slug: string; name: string; isPublished: boolean };

type PieceDialogProps = {
  target: PieceTarget;
  styles: string[];
  artists?: ArtistOption[];
  defaultArtist?: string | null;
  onClose: () => void;
  onDone: (id: string, piece: ManagedPiece | null) => void;
};

export function PieceDialog({
  target,
  styles,
  artists,
  defaultArtist,
  onClose,
  onDone,
}: PieceDialogProps) {
  return (
    <Dialog
      open={target !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-none border border-border bg-background sm:max-w-3xl"
      >
        {target && (
          <PieceForm
            key={target === "new" ? "new" : target.id}
            piece={target === "new" ? null : target}
            styles={styles}
            artists={artists}
            defaultArtist={defaultArtist}
            onClose={onClose}
            onDone={onDone}
          />
        )}
        <DialogCloseButton className="top-3 right-3" />
      </DialogContent>
    </Dialog>
  );
}

type PieceFormProps = Omit<PieceDialogProps, "target"> & {
  piece: ManagedPiece | null;
};

function PieceForm({ piece, styles, artists, defaultArtist, onClose, onDone }: PieceFormProps) {
  const fetcher = useFetcher<PortfolioActionResult>();
  const id = useId();
  const isNew = piece === null;
  const [imgUrl, setImgUrl] = useState(piece?.imgUrl ?? "");
  const [style, setStyle] = useState(piece?.style ?? "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const pendingIntent = fetcher.state !== "idle" ? fetcher.formData?.get("intent") : null;
  const isBusy = pendingIntent != null;
  const failed = fetcher.state === "idle" && fetcher.data && !fetcher.data.ok ? fetcher.data : null;
  const errorFor = (field: string) => (failed?.field === field ? failed.error : null);
  const formError = failed && !fieldNames.includes(failed.field ?? "") ? failed.error : null;
  const previewUrl = imgUrl.trim().startsWith("https://") ? imgUrl.trim() : null;
  const pieceId = piece?.id ?? "";

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data?.ok) return;

    if (fetcher.data.intent === "delete") {
      onDone(pieceId, null);
    } else if (fetcher.data.piece) {
      onDone(fetcher.data.piece.id, fetcher.data.piece);
    }
  }, [fetcher.state, fetcher.data, onDone, pieceId]);

  return (
    <fetcher.Form
      method="post"
      className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-[14rem_minmax(0,1fr)]"
    >
      {piece && <input type="hidden" name="id" value={piece.id} />}

      <div
        aria-hidden="true"
        className="mx-auto grid aspect-square w-full max-w-xs min-w-0 place-items-center overflow-hidden border border-border bg-surface-raised text-center text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground sm:max-w-none"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="block size-full max-w-full object-contain" />
        ) : (
          <span className="p-3">Paste a photo address to see it here</span>
        )}
      </div>

      <div className="grid min-w-0 content-start gap-5">
        <DialogTitle className="font-display text-2xl uppercase">
          {isNew ? "Add a piece" : "Edit piece"}
        </DialogTitle>

        {isNew && artists && (
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-artist`} className={labelClasses}>
              Artist
            </label>
            <select
              id={`${id}-artist`}
              name="artist"
              defaultValue={defaultArtist ?? ""}
              aria-invalid={errorFor("artist") ? true : undefined}
              className={controlClasses}
            >
              <option value="">Choose an artist…</option>
              {artists.map((artist) => (
                <option key={artist.slug} value={artist.slug}>
                  {artist.name}
                  {artist.isPublished ? "" : " (draft)"}
                </option>
              ))}
            </select>
            {errorFor("artist") && <p className="text-sm text-destructive">{errorFor("artist")}</p>}
          </div>
        )}

        <div className="grid gap-1.5">
          <label htmlFor={`${id}-url`} className={labelClasses}>
            Photo address
          </label>
          <input
            id={`${id}-url`}
            type="url"
            name="imgUrl"
            value={imgUrl}
            onChange={(event) => setImgUrl(event.target.value)}
            placeholder="https://…"
            autoComplete="off"
            autoFocus={isNew}
            aria-invalid={errorFor("imgUrl") ? true : undefined}
            aria-describedby={errorFor("imgUrl") ? `${id}-url-error` : undefined}
            className={controlClasses}
          />
          {errorFor("imgUrl") && (
            <p id={`${id}-url-error`} className="text-sm text-destructive">
              {errorFor("imgUrl")}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label htmlFor={`${id}-style`} className={labelClasses}>
            Style
          </label>
          <input
            id={`${id}-style`}
            type="text"
            name="style"
            value={style}
            onChange={(event) => setStyle(event.target.value.toLowerCase())}
            maxLength={40}
            autoCapitalize="none"
            autoComplete="off"
            aria-invalid={errorFor("style") ? true : undefined}
            aria-describedby={`${id}-style-help`}
            className={controlClasses}
          />
          <p id={`${id}-style-help`} className="text-xs text-muted-foreground">
            {errorFor("style") ? (
              <span className="text-destructive">{errorFor("style")}</span>
            ) : (
              "Type a new style, or pick one the shop already uses:"
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={option === style.trim()}
                onClick={() => setStyle(option)}
                className="border border-border px-2.5 py-1 text-xs transition-colors hover:border-accent hover:text-accent aria-pressed:border-accent aria-pressed:text-accent"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <TagListInput name="tags" initialTags={piece?.tags ?? []} error={errorFor("tags")} />

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            name="intent"
            value={isNew ? "create" : "update"}
            variant="brand"
            size="sm"
            disabled={isBusy}
          >
            {pendingIntent === "create"
              ? "Adding…"
              : pendingIntent === "update"
                ? "Saving…"
                : isNew
                  ? "Add piece"
                  : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={onClose}
          >
            Cancel
          </Button>

          {!isNew && !isConfirmingDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto rounded-none text-muted-foreground hover:text-destructive"
              onClick={() => setIsConfirmingDelete(true)}
            >
              Delete…
            </Button>
          )}
        </div>

        {isConfirmingDelete && (
          <div className="grid gap-3 border-t border-border pt-4">
            <p className="text-sm">Delete this piece? It's removed from the site right away.</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                name="intent"
                value="delete"
                formNoValidate
                variant="destructive"
                size="sm"
                className="rounded-none"
                disabled={isBusy}
              >
                {pendingIntent === "delete" ? "Deleting…" : "Delete piece"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Keep it
              </Button>
            </div>
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
