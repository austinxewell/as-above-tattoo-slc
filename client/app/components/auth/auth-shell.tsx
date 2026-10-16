import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  children: ReactNode;
};

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="w-full max-w-sm">
        <div className="relative isolate mx-auto w-fit p-6">
          <div
            className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-2xl"
            aria-hidden="true"
          />
          <img
            src="/images/logos/circle-seal.webp"
            alt=""
            width={500}
            height={500}
            className="w-24"
          />
        </div>

        <h1 className="mt-6 text-center font-display text-3xl uppercase tracking-[-0.02em]">
          {title}
        </h1>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
