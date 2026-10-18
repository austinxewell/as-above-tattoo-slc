import { Link } from "react-router";
import { RotateCw } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ErrorStateProps = {
  homeTo?: string;
  homeLabel?: string;
  className?: string;
};

export function ErrorState({
  homeTo = "/",
  homeLabel = "Back to home",
  className,
}: ErrorStateProps) {
  return (
    <section
      aria-labelledby="error-title"
      className={cn(
        "flex min-h-[60svh] flex-col gap-14 px-6 py-24 md:flex-row md:items-center md:justify-between md:px-[6.2vw]",
        className,
      )}
    >
      <div className="flex flex-col">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">Error</p>
        <h1
          id="error-title"
          className="mt-6 font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl"
        >
          Something went wrong
        </h1>
        <p className="mt-6 max-w-[390px] text-muted-foreground">
          The signal got crossed on our end. Give it a moment, then try again.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(buttonVariants({ variant: "brand", size: "cta" }))}
          >
            Try again
            <RotateCw className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <Link
            to={homeTo}
            className="border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
          >
            {homeLabel}
          </Link>
        </div>
      </div>

      <div className="relative isolate self-center p-10">
        <div
          className="absolute inset-0 -z-10 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <img
          src="/images/logos/circle-seal.webp"
          alt=""
          width={500}
          height={500}
          className="w-48 md:w-64 lg:w-72"
        />
      </div>
    </section>
  );
}
