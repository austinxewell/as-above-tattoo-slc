import type { ReactNode } from "react";

type ProofGroupProps = {
  title: string;
  children: ReactNode;
};

export function ProofGroup({ title, children }: ProofGroupProps) {
  return (
    <section>
      <h2 className="font-display text-xl">{title}</h2>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}

type ProofRowProps = {
  mark: string;
  label: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ProofRow({ mark, label, action, children }: ProofRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-t border-border py-4 md:grid-cols-[2rem_8rem_minmax(0,1fr)_auto]">
      <span aria-hidden="true" className="hidden font-display text-accent md:block">
        {mark}
      </span>
      <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground md:pt-1">
        {label}
      </dt>
      <dd className="col-span-2 min-w-0 md:col-span-1">{children}</dd>
      {action && (
        <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">{action}</div>
      )}
    </div>
  );
}
