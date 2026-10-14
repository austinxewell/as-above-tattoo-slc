import { useState, type ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function FadeInImage({ className, onLoad, ...props }: ComponentProps<"img">) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <span
          className="absolute inset-0 animate-pulse bg-muted motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
      <img
        loading="lazy"
        {...props}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        className={cn(
          "transition duration-700 ease-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
