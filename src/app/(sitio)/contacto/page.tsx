import { Alert } from "@/components/ui/alert";
import { ContactForm } from "@/components/store/contact-form";
import { PageHeader } from "@/components/store/page-header";
import { getStoreInfo } from "@/lib/api";

export const metadata = {
  title: "Contacto",
  description: "Cuéntanos qué necesitas y para cuándo, y confirmamos tu encargo.",
};

export default async function ContactoPage() {
  const store = await getStoreInfo();

  const rows: Array<{ label: string; value: string; href?: string }> = [];
  if (store.whatsapp) {
    rows.push({
      label: "WhatsApp",
      value: store.whatsapp,
      href: `https://wa.me/${store.whatsapp.replace(/[^\d]/g, "")}`,
    });
  }
  if (store.phone) {
    rows.push({ label: "Teléfono", value: store.phone, href: `tel:${store.phone}` });
  }
  if (store.email) {
    rows.push({ label: "Correo", value: store.email, href: `mailto:${store.email}` });
  }
  if (store.address) rows.push({ label: "Dirección", value: store.address });
  if (store.city) rows.push({ label: "Ciudad", value: store.city });
  if (store.instagram) {
    rows.push({
      label: "Instagram",
      value: store.instagram,
      href: `https://instagram.com/${store.instagram.replace(/^@/, "")}`,
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de tu encargo"
        description="Cuéntanos sabor, tamaño y para cuándo lo necesitas. Te confirmamos disponibilidad y fecha."
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-2xl text-cacao">Dónde y cómo</h2>
            {rows.length > 0 ? (
              <dl className="flex flex-col gap-3">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-col">
                    <dt className="font-sans text-xs uppercase tracking-[0.14em] text-tinta-suave">
                      {row.label}
                    </dt>
                    <dd className="text-cacao">
                      {row.href ? (
                        <a
                          className="text-guayaba-tinta underline decoration-kraft underline-offset-4 hover:text-cacao"
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-tinta-suave">
                Los datos de contacto aún no están confirmados. Por ahora
                déjanos tu mensaje en el formulario.
              </p>
            )}
          </div>

          {store.hours.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl text-cacao">Horarios</h2>
              <ul className="flex flex-col gap-1 text-sm text-cacao/90">
                {store.hours.map((hour) => (
                  <li key={hour}>{hour}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Alert tone="info" title="Envío por WhatsApp">
            Mientras no exista el endpoint del backend, al enviar el formulario
            se abre WhatsApp con tu mensaje listo. El envío automático llega en
            una etapa posterior.
          </Alert>
        </div>

        <ContactForm whatsapp={store.whatsapp ?? null} />
      </div>
    </main>
  );
}
