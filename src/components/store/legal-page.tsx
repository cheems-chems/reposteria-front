import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

interface LegalPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        title={title}
        description={description}
      />

      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-serif text-2xl text-vino">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-vino/90">
        {children}
      </div>
    </section>
  );
}
