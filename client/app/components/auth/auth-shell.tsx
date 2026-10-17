import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

type AuthShellProps = {
  title: string;
  children: ReactNode;
};

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="dark min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[minmax(22rem,34rem)_1fr]">
      <aside className="relative isolate flex items-center justify-center gap-5 overflow-hidden border-b border-border bg-surface px-6 py-8 lg:flex-col lg:gap-10 lg:border-r lg:border-b-0 lg:py-16">
        <div
          className="absolute top-1/2 left-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl lg:size-[28rem]"
          aria-hidden="true"
        />
        <img
          src="/images/logos/circle-seal.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-24 -z-10 hidden w-[26rem] rotate-12 opacity-[0.06] lg:block"
        />

        <img
          src="/images/logos/tarot-card.webp"
          alt=""
          width={700}
          height={1146}
          className="w-16 -rotate-3 shadow-xl shadow-black/50 lg:w-56"
        />
        <img
          src="/images/logos/stacked-shop-name-transparent.png"
          alt="As Above Tattoo SLC"
          className="w-28 object-contain lg:w-48"
        />
      </aside>

      <section className="flex flex-col px-6 py-8 lg:min-h-screen lg:px-16 lg:py-12">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-3 text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent-hover"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Back to website
        </Link>

        <div className="flex flex-1 items-center justify-center py-12 lg:justify-start lg:pl-[max(0rem,calc(50vw-50rem))]">
          <div className="w-full max-w-sm">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">
              Staff portal
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em]">
              {title}
            </h1>

            <div className="mt-10">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
