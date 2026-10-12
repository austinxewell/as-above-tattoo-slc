import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    title: "Consult",
    description: "Share your idea, placement, and size with your artist.",
  },
  {
    title: "Design",
    description: "Your artist draws a custom piece made just for you.",
  },
  {
    title: "Session",
    description: "Settle in. We take our time so it's done right.",
  },
  {
    title: "Heal",
    description: "Follow our after care guide so your tattoo stays sharp.",
    link: { label: "After care guide", to: "/after-care" },
  },
];

export function StudioProcess() {
  return (
    <section
      className="bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="studio-process-title"
    >
      <SectionHeading
        id="studio-process-title"
        index="05"
        eyebrow="The process"
        title="From idea to ink"
        description="Getting tattooed should feel intentional, not intimidating. Here's what to expect."
      />

      <ol className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col bg-background p-8">
            <span className="font-display text-3xl text-accent">0{index + 1}</span>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em]">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>

            {step.link && (
              <Link
                to={step.link.to}
                className="mt-auto self-start border-b border-accent pt-6 pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
              >
                {step.link.label}
              </Link>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-wrap items-center gap-8">
        <Link
          to="/booking"
          className={cn(buttonVariants({ variant: "brand", size: "cta" }), "min-h-[52px] gap-6")}
        >
          Start your booking
          <ArrowRight className="size-[18px]" strokeWidth={1.5} />
        </Link>

        <Link
          to="/pricing"
          className="border-b border-accent pb-1 text-[0.65rem] font-medium uppercase tracking-[0.17em]"
        >
          See pricing
        </Link>
      </div>
    </section>
  );
}
