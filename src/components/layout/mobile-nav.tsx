"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/components/layout/nav-links";

// Menú hamburguesa (< md): panel desplegable bajo el header; se cierra al tocar un enlace.
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-soft border border-borde text-vino transition-colors duration-150 ease-suave hover:bg-rosa-claro/40"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <nav
          id="menu-movil"
          aria-label="Navegación principal"
          className="absolute inset-x-0 top-full border-b border-borde bg-lienzo px-5 py-2 shadow-lg"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-soft px-3 font-sans text-base text-vino transition-colors duration-150 ease-suave hover:bg-rosa-claro/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
