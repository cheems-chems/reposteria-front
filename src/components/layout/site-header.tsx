import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/encargo", label: "Encargo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-bg/95 backdrop-blur supports-backdrop-filter:bg-bg/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Logo size="sm" />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 sm:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-soft px-3 py-2 font-sans text-sm text-brown-text/80 transition-colors hover:bg-soft-pink/40 hover:text-brown-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href="/encargo" size="sm" className="shrink-0">
          Hacer encargo
        </ButtonLink>
      </div>

      <nav
        aria-label="Navegación principal"
        className="flex gap-1 overflow-x-auto border-t border-linea px-3 py-1.5 sm:hidden"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-soft px-3 py-1.5 font-sans text-sm text-brown-text/80 transition-colors hover:bg-soft-pink/40 hover:text-brown-text"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
