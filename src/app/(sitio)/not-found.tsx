import { PageHeader } from "@/components/store/page-header";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
      <PageHeader
        eyebrow="Error 404"
        title="No encontramos esta página"
        description="Puede que el enlace haya cambiado o que el producto ya no esté disponible."
      />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href="/tienda" variant="secondary">
          Ver la tienda
        </ButtonLink>
      </div>
    </main>
  );
}
