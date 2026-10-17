type PortalPlaceholderProps = {
  title: string;
  description: string;
};

export function PortalPlaceholder({ title, description }: PortalPlaceholderProps) {
  return (
    <section>
      <h1 className="font-display text-3xl uppercase">{title}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>
    </section>
  );
}
