import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";
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
  // La franja superior solo aparece si hay WhatsApp configurado en brand.ts.

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-lienzo/95 backdrop-blur supports-backdrop-filter:bg-lienzo/80">
   

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
              className="rounded-soft px-3 py-2 font-sans text-sm text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <ButtonLink href="/encargo" size="sm" className="shrink-0">
            Hacer encargo
          </ButtonLink>
        </div>
      </div>

      <nav
        aria-label="Navegación principal"
        className="flex gap-1 overflow-x-auto border-t border-borde px-3 py-1.5 sm:hidden"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-soft px-3 py-1.5 font-sans text-sm text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
