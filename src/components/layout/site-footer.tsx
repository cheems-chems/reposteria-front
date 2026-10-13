import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { getCategories, getStoreInfo } from "@/lib/api";

const legalLinks = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/devoluciones", label: "Envíos y devoluciones" },
];

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-tinta-suave">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm text-cacao/90">{children}</div>
    </div>
  );
}

export async function SiteFooter() {
  const [store, categories] = await Promise.all([
    getStoreInfo(),
    getCategories(),
  ]);

  const contactLines = [
    store.address,
    store.city,
    store.whatsapp ? `WhatsApp: ${store.whatsapp}` : null,
    store.phone ? `Teléfono: ${store.phone}` : null,
    store.email,
    ...store.hours,
  ].filter(Boolean) as string[];

  return (
    <footer className="mt-16 border-t border-linea bg-papel">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo size="sm" />
          <p className="max-w-xs text-sm text-tinta-suave">
            {store.description}
          </p>
        </div>

        <Column title="Tienda">
          <Link className="hover:text-cacao" href="/tienda">
            Todo el catálogo
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              className="hover:text-cacao"
              href={`/tienda/${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </Column>

        <Column title="Legal">
          {legalLinks.map((link) => (
            <Link key={link.href} className="hover:text-cacao" href={link.href}>
              {link.label}
            </Link>
          ))}
        </Column>

        <Column title="Contacto">
          {contactLines.length > 0 ? (
            contactLines.map((line) => <p key={line}>{line}</p>)
          ) : (
            <p className="text-tinta-suave">
              Datos de contacto pendientes de confirmar.
            </p>
          )}
          <Link className="text-guayaba-tinta hover:text-cacao" href="/contacto">
            Escríbenos
          </Link>
        </Column>
      </div>
    </footer>
  );
}
