export type PageHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, titleId, description }: PageHeaderProps) {
  return (
    <>
      <p className="flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.36em] text-accent">
        <span>{eyebrow}</span>
        <span className="h-px w-12 bg-accent" aria-hidden="true" />
      </p>

      <h1
        id={titleId}
        className="mt-6 font-display text-5xl uppercase leading-[0.91] tracking-[-0.055em] md:text-7xl"
      >
        {title}
      </h1>

      {description && (
        <p className="mt-6 max-w-md leading-7 text-muted-foreground">{description}</p>
      )}
    </>
  );
}
