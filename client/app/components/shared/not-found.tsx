import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function NotFound() {
  return (
    <section
      className="flex min-h-[60svh] flex-col gap-14 px-6 py-24 md:flex-row md:items-center md:justify-between md:px-[6.2vw]"
      aria-labelledby="not-found-title"
    >
      <div className="flex flex-col">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">404</p>
        <h1
          id="not-found-title"
          className="mt-6 font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl"
        >
          Page not found
        </h1>
        <p className="mt-6 max-w-[390px] text-muted-foreground">
          The cards didn't reveal this one. The page may have moved, or the link might be wrong.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link to="/" className={cn(buttonVariants({ variant: "brand", size: "cta" }))}>
            Back to home
          </Link>
          <Link
            to="/portfolio"
            className="border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
          >
            Browse the portfolio
          </Link>
        </div>
      </div>

      <div className="relative isolate self-center p-10">
        <div
          className="absolute inset-0 -z-10 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 rounded-full border border-accent/30"
          aria-hidden="true"
        />
        <img
          src="/images/logos/tarot-card.webp"
          alt=""
          width={700}
          height={1146}
          className="w-48 -rotate-3 shadow-2xl shadow-black/50 md:w-64 lg:w-72"
        />
      </div>
    </section>
  );
}
