import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "./page-header";

interface LegalPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Envoltorio para las páginas legales. Deja claro que el contenido es un
 * BORRADOR sin revisar y que los datos entre corchetes se completan con
 * información real del negocio.
 */
export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader eyebrow="Legal · Borrador" title={title} description={description} />

      <Alert tone="warning" title="Borrador sin revisar" className="mt-8">
        Este texto es un borrador de trabajo. Debe ser revisado por asesoría
        legal antes de publicarse. Los datos entre corchetes se completan con la
        información real del negocio.
      </Alert>

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
      <h2 className="font-serif text-2xl text-brown-text">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-brown-text/90">
        {children}
      </div>
    </section>
  );
}
