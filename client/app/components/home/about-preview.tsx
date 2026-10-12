import { SectionHeading } from "./section-heading";

type AboutPreviewProps = {
  about: {
    heading: string;
    body: string;
    values: { id: number; title: string; description: string }[];
  };
};

export function AboutPreview({ about }: AboutPreviewProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-surface px-6 py-24 md:px-[6.2vw] md:py-32"
      aria-labelledby="about-preview-title"
    >
      <img
        src="/images/logos/circle-seal.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-32 -z-10 w-[32rem] -translate-y-1/2 opacity-[0.18] dark:opacity-[0.07]"
      />
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
        <SectionHeading
          id="about-preview-title"
          index="03"
          eyebrow="The studio"
          title={about.heading}
          description={about.body}
        />

        <ul className="lg:pt-12">
          {about.values.map((value) => (
            <li
              key={value.id}
              className="grid gap-2 border-t border-border py-7 last:border-b sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <h3 className="font-display text-2xl text-accent">{value.title}</h3>
              <p className="leading-7 text-muted-foreground">{value.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
