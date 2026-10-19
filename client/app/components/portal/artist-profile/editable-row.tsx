import { useEffect, useRef, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { ProofRow } from "./proof-row";

type EditableRowProps = {
  mark: string;
  label: string;
  isEditing: boolean;
  onEdit: () => void;
  editor: ReactNode;
  children: ReactNode;
};

export function EditableRow({
  mark,
  label,
  isEditing,
  onEdit,
  editor,
  children,
}: EditableRowProps) {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(isEditing);

  useEffect(() => {
    const focusWasLost = document.activeElement === document.body;
    if (wasEditing.current && !isEditing && focusWasLost) editButtonRef.current?.focus();
    wasEditing.current = isEditing;
  }, [isEditing]);

  return (
    <ProofRow
      mark={mark}
      label={label}
      action={
        !isEditing && (
          <button
            ref={editButtonRef}
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${label.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
          >
            <Pencil className="size-3" strokeWidth={1.5} aria-hidden="true" />
            Edit
          </button>
        )
      }
    >
      {isEditing ? editor : children}
    </ProofRow>
  );
}
