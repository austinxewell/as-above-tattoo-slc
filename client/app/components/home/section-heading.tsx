type SectionHeadingProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ id, index, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">
        <span>{index}</span>
        <span className="h-px w-12 bg-accent" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>

      <h2
        id={id}
        className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl"
      >
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-md leading-7 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
