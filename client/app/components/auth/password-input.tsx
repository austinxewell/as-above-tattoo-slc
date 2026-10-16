import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative mt-3">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className="w-full border border-border bg-background py-3 pr-12 pl-4 outline-none transition-colors focus:border-accent"
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-accent"
      >
        {isVisible ? (
          <EyeOff className="size-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Eye className="size-4" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
