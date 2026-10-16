import { CartButton } from "@/components/cart/cart-button";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navLinks } from "@/components/layout/nav-links";
import { ButtonLink } from "@/components/ui/button-link";
import Link from "next/link";

export function SiteHeader() {
  // La franja superior solo aparece si hay WhatsApp configurado en brand.ts.

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-lienzo/95 backdrop-blur supports-backdrop-filter:bg-lienzo/80">
      <div className="mx-auto flex min-h-[68px] w-full max-w-6xl items-center gap-3 px-4 py-2 sm:min-h-[76px] sm:gap-4 sm:px-8">
        <Logo size="header" showText={false} className="shrink-0" />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 sm:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-soft px-3 py-2 font-sans text-sm text-vino/80 transition-colors duration-150 ease-suave hover:bg-rosa-claro/40 hover:text-vino"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <CartButton />
          <ButtonLink
            href="/encargo"
            size="sm"
            className="shrink-0 whitespace-nowrap"
          >
            Hacer encargo
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
