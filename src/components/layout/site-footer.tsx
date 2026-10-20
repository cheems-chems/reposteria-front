import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CopyrightYear } from "@/components/layout/copyright-year";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { getCategories, getStoreInfo } from "@/lib/api";
import { brand } from "@/lib/brand";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { footerContent } from "@/content/footer";

const linkClass =
  "-mx-2 flex min-h-11 items-center rounded-soft px-2 text-[15px] text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino lg:min-h-9";

/** +57 316 186 5235 a partir de "573161865235". */
function formatWhatsAppNumber(raw?: string | null): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 12 && digits.startsWith("57")) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-vino/80">
      {children}
    </h2>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export async function SiteFooter() {
  const [store, categories] = await Promise.all([
    getStoreInfo(),
    getCategories(),
  ]);

  const waNumber = normalizeWhatsApp(store.whatsapp);
  const waHref = waNumber
    ? whatsappUrl(waNumber, brand.contact.whatsappMessage)
    : null;
  const waDisplay =
    footerContent.contact.whatsappDisplay ||
    formatWhatsAppNumber(store.whatsapp) ||
    null;
  const instagramHref = footerContent.social.instagram || null;

  return (
    <footer className="mt-16 border-t border-rosa-medio/60 bg-gradient-to-b from-rosa-palido/80 via-rosa-palido/30 to-rosa-palido/20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.3fr_1fr_1.2fr] lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <Logo size="footer" showText={false} className="self-start" />
          <p className="max-w-xs text-sm text-texto-suave">
            {footerContent.tagline}
          </p>
          {instagramHref ? (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-11 items-center justify-center rounded-full border border-borde bg-lienzo/60 text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro hover:text-vino"
            >
              <InstagramIcon className="size-5" />
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <ColumnTitle>Tienda</ColumnTitle>
          <nav
            className="grid grid-cols-2 gap-x-4 lg:flex lg:flex-col lg:gap-y-0"
            aria-label="Tienda"
          >
            <Link className={linkClass} href="/tienda">
              Todo el catálogo
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                className={linkClass}
                href={`/tienda/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <ColumnTitle>Contacto</ColumnTitle>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses({ variant: "primary" })} presion mt-1 w-fit items-center gap-2 whitespace-nowrap px-5 py-3`}
            >
              <WhatsAppIcon className="size-5" />
              {footerContent.contact.whatsappLabel}
            </a>
          ) : null}
          {waHref && waDisplay ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 flex min-h-11 items-center gap-2 rounded-soft px-2 text-[15px] text-vino/90 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino"
            >
              <WhatsAppIcon className="size-4 shrink-0 text-whatsapp" />
              <span className="tabular">{waDisplay}</span>
            </a>
          ) : waDisplay ? (
            <p className="tabular text-[15px] text-vino/90">{waDisplay}</p>
          ) : null}
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2 text-[15px] text-vino/90">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-vino/70" />
              <span>{footerContent.contact.city}</span>
            </li>
            {footerContent.contact.hours.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-[15px] text-vino/90"
              >
                <ClockIcon className="mt-0.5 size-4 shrink-0 text-vino/70" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rosa-medio/50 pb-24 lg:pb-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-6 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-8 sm:text-left">
          <p className="font-sans text-xs text-texto-suave">
            © <CopyrightYear /> {footerContent.copyright.name} ·{" "}
            {footerContent.copyright.suffix}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4">
            {footerContent.legal.map((link) => (
              <li key={link.href}>
                <Link
                  className="inline-flex min-h-11 items-center px-1 font-sans text-xs text-texto-suave transition-colors duration-150 ease-suave hover:text-vino"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
