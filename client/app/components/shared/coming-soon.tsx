import { Link } from "react-router";

type ComingSoonProps = {
  title: string;
  description?: string;
};

export function ComingSoon({
  title,
  description = "We're putting the finishing touches on this page. Check back soon.",
}: ComingSoonProps) {
  return (
    <section
      className="flex min-h-[60svh] flex-col gap-14 px-6 py-24 md:flex-row md:items-center md:justify-between md:px-[6.2vw]"
      aria-labelledby="coming-soon-title"
    >
      <div className="flex flex-col">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">
          Coming soon
        </p>

        <h1
          id="coming-soon-title"
          className="mt-6 font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl"
        >
          {title}
        </h1>

        <p className="mt-6 max-w-[390px] text-muted-foreground">{description}</p>

        <Link
          to="/"
          className="mt-8 self-start border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
        >
          Back to home
        </Link>
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
