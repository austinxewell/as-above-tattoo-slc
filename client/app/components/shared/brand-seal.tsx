import { cn } from "~/lib/utils";

export function BrandSeal({ className }: { className?: string }) {
  return (
    <>
      <img
        src="/images/logos/circle-logo.webp"
        alt=""
        width={64}
        height={64}
        loading="lazy"
        className={cn("shrink-0 rounded-full dark:hidden", className)}
      />
      <img
        src="/images/logos/circle-seal.webp"
        alt=""
        width={64}
        height={64}
        loading="lazy"
        className={cn("hidden shrink-0 dark:block", className)}
      />
    </>
  );
}
