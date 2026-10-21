import { useId, useState } from "react";
import { Form, Link, useNavigation } from "react-router";
import { cn } from "cn";
import { Button } from "~/components/ui/button";
import { controlClasses } from "~/components/portal/artist-profile/text-edit-form";

type RemovalConfirmProps = {
  confirmName: string;
  buttonLabel: string;
  intent: "remove-user" | "remove-profile";
  slug?: string;
  locked: boolean;
  error: string | null;
};

export function RemovalConfirm({
  confirmName,
  buttonLabel,
  intent,
  slug,
  locked,
  error,
}: RemovalConfirmProps) {
  const [typed, setTyped] = useState("");
  const navigation = useNavigation();
  const id = useId();
  const isRemoving = navigation.state !== "idle" && navigation.formData?.get("intent") === intent;
  const matches = typed.trim() === confirmName;

  return (
    <Form method="post" className={cn("mt-8 grid max-w-md gap-3", locked && "opacity-55")}>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="name" value={confirmName} />
      {slug && <input type="hidden" name="slug" value={slug} />}

      <label htmlFor={`${id}-name`} className="text-sm">
        Type <span className="bg-surface-raised px-1.5 font-semibold">{confirmName}</span> to
        confirm.
      </label>
      <input
        id={`${id}-name`}
        type="text"
        autoComplete="off"
        spellCheck={false}
        disabled={locked}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClasses}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          variant="destructive"
          className="rounded-none"
          disabled={locked || !matches || isRemoving}
        >
          {isRemoving ? "Removing…" : buttonLabel}
        </Button>
        <Button
          render={<Link to="/portal/admin/staff" />}
          nativeButton={false}
          variant="outline"
          className="rounded-none"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
