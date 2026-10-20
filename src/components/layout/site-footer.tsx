import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CopyrightYear } from "@/components/layout/copyright-year";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { getStoreInfo } from "@/lib/api";
import { brand } from "@/lib/brand";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { footerContent } from "@/content/footer";

const linkClass =
  "-mx-2 flex min-h-11 items-center rounded-soft px-2 text-[15px] text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino md:min-h-0 md:py-1";

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
    <h2 className="font-sans text-[11px] uppercase tracking-[0.16em] text-vino/80">
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
  const store = await getStoreInfo();

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
    <footer className="relative mt-16">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-6 px-5 py-8 sm:px-8 md:grid-cols-[1.3fr_1fr_1.2fr] md:gap-x-6 md:py-10 md:gap-y-8">
        <div className="flex flex-col items-start gap-2">
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
              className="mt-1 flex size-10 items-center justify-center rounded-full border border-borde bg-lienzo/60 text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro hover:text-vino"
            >
              <InstagramIcon className="size-5" />
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <ColumnTitle>Tienda</ColumnTitle>
          <nav
            className="grid grid-cols-2 gap-x-6 gap-y-0 md:grid-cols-1"
            aria-label="Tienda"
          >
            {footerContent.store.map((item) => (
              <Link key={item.href} className={linkClass} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <ColumnTitle>Contacto</ColumnTitle>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses({ variant: "primary" })} presion w-fit items-center gap-2 whitespace-nowrap px-5 py-2.5`}
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
              className="-mx-2 flex min-h-11 items-center gap-2 rounded-soft px-2 text-[15px] text-vino/90 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino md:min-h-0 md:py-0.5"
            >
              <WhatsAppIcon className="size-4 shrink-0 text-whatsapp" />
              <span className="tabular">{waDisplay}</span>
            </a>
          ) : waDisplay ? (
            <p className="tabular text-[15px] text-vino/90">{waDisplay}</p>
          ) : null}
          <ul className="flex flex-col gap-1">
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

      <div className="relative border-t border-rosa-medio/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-5 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-8 sm:py-4 sm:text-left">
          <p className="font-sans text-xs text-texto-suave">
            © <CopyrightYear /> {footerContent.copyright.name} ·{" "}
            {footerContent.copyright.suffix}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4">
            {footerContent.legal.map((link) => (
              <li key={link.href}>
                <Link
                  className="inline-flex items-center px-1 font-sans text-xs text-texto-suave transition-colors duration-150 ease-suave hover:text-vino"
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
