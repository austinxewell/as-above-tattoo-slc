import { useEffect, useId, useState } from "react";
import { useFetcher } from "react-router";
import { Check, LoaderCircle, Plus } from "lucide-react";
import { cn } from "~/lib/utils";
import { roleLabels, type StaffActionResult, type StaffRole } from "~/lib/staff";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";

const STAFF_ACTION = "/portal/admin/staff";

const inputClasses =
  "w-full border border-border bg-background px-3 py-2.5 text-base outline-none transition-colors focus-visible:border-accent aria-invalid:border-destructive";
const labelClasses = "text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground";

const roleHints: Record<StaffRole, string> = {
  artist: "Manages their own requests and profile. Starts with a draft artist profile.",
  admin: "Manages bookings, artists, and staff.",
};

type AddPersonFormProps = {
  defaultRole: StaffRole;
  fixedRole?: StaffRole;
  onAdded: (name: string) => void;
  onCancel: () => void;
};

function AddPersonForm({ defaultRole, fixedRole, onAdded, onCancel }: AddPersonFormProps) {
  const fetcher = useFetcher<StaffActionResult>();
  const id = useId();
  const [role, setRole] = useState<StaffRole>(fixedRole ?? defaultRole);
  const [withProfile, setWithProfile] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const isSaving = fetcher.state !== "idle";
  const result = isSaving ? undefined : fetcher.data;

  function errorFor(field: string) {
    return result && !result.ok && result.field === field ? result.error : null;
  }

  const nameError = errorFor("name");
  const emailError = errorFor("email");
  const generalError = result && !result.ok && !result.field ? result.error : null;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) onAdded(submittedName);
  }, [fetcher.state, fetcher.data, onAdded, submittedName]);

  return (
    <fetcher.Form
      method="post"
      action={STAFF_ACTION}
      className="mt-6 grid gap-5"
      onSubmit={(event) =>
        setSubmittedName(String(new FormData(event.currentTarget).get("name") ?? ""))
      }
    >
      <input type="hidden" name="intent" value="create" />

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-name`} className={labelClasses}>
          Name
        </label>
        <input
          id={`${id}-name`}
          name="name"
          required
          maxLength={60}
          autoComplete="off"
          autoFocus
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? `${id}-name-error` : undefined}
          className={inputClasses}
        />
        {nameError && (
          <p id={`${id}-name-error`} role="alert" className="text-sm text-destructive">
            {nameError}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-email`} className={labelClasses}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="off"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${id}-email-error` : undefined}
          className={inputClasses}
        />
        {emailError && (
          <p id={`${id}-email-error`} role="alert" className="text-sm text-destructive">
            {emailError}
          </p>
        )}
      </div>

      {fixedRole ? (
        <>
          <input type="hidden" name="role" value={fixedRole} />
          <p className="text-sm text-muted-foreground">{roleHints[fixedRole]}</p>
        </>
      ) : (
        <fieldset className="grid gap-2">
          <legend className={labelClasses}>Role</legend>
          <div className="mt-1.5 grid w-fit grid-cols-2 border border-border">
            {(["artist", "admin"] as const).map((option) => (
              <label
                key={option}
                className={cn(
                  "cursor-pointer px-5 py-1.5 text-center text-[0.62rem] uppercase tracking-[0.2em] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  role === option
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-accent",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={role === option}
                  onChange={() => {
                    setRole(option);
                    setWithProfile(false);
                  }}
                  className="sr-only"
                />
                {roleLabels[option]}
              </label>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{roleHints[role]}</p>
        </fieldset>
      )}

      {role === "admin" && (
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="withArtistProfile"
            checked={withProfile}
            onChange={(event) => setWithProfile(event.target.checked)}
            className="mt-1 size-4 accent-accent"
          />
          <span>
            Also give them an artist profile
            <span className="block text-muted-foreground">
              For admins who also tattoo. It starts as a draft.
            </span>
          </span>
        </label>
      )}

      {generalError && (
        <p role="alert" className="text-sm text-destructive">
          {generalError}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          We'll email them an invite to set a password.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="brand" size="sm" disabled={isSaving}>
            {isSaving ? "Adding" : "Add and invite"}
            {isSaving && (
              <LoaderCircle
                className="size-3.5 animate-spin"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}

type AddPersonDialogProps = {
  triggerLabel: string;
  defaultRole?: StaffRole;
  fixedRole?: StaffRole;
};

export function AddPersonDialog({
  triggerLabel,
  defaultRole = "artist",
  fixedRole,
}: AddPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {lastAdded && (
        <p role="status" className="inline-flex items-center gap-1.5 text-sm text-success">
          <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
          {lastAdded} was added. Their invite is on its way.
        </p>
      )}

      <Button
        type="button"
        variant="brand"
        size="cta"
        onClick={() => {
          setLastAdded(null);
          setOpen(true);
        }}
      >
        <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border border-border bg-background">
          <DialogTitle className="font-display text-2xl uppercase">{triggerLabel}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add someone to the staff portal. Only a name, email, and role are needed.
          </DialogDescription>
          <AddPersonForm
            defaultRole={defaultRole}
            fixedRole={fixedRole}
            onAdded={(name) => {
              setOpen(false);
              setLastAdded(name);
            }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
