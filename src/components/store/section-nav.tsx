import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Section } from "@/lib/api";

const base =
  "flex min-h-11 items-center whitespace-nowrap rounded-soft border px-4 font-sans text-sm transition-colors";

/**
 * Fila superior de secciones (Todo · Dulces · Salados). Se refleja en la URL
 * con ?seccion=<slug>. No hay slugs ni nombres fijos: vienen de los datos.
 */
export function SectionNav({
  sections,
  current,
}: {
  sections: Section[];
  current?: string | null;
}) {
  return (
    <nav
      aria-label="Filtrar por sección"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      <Link
        href="/tienda"
        aria-current={!current ? "page" : undefined}
        className={cn(
          base,
          !current
            ? "border-fuchsia bg-fuchsia text-white"
            : "border-linea text-brown-text/80 hover:bg-soft-pink/40",
        )}
      >
        Todo
      </Link>
      {sections.map((section) => (
        <Link
          key={section.slug}
          href={`/tienda?seccion=${section.slug}`}
          aria-current={current === section.slug ? "page" : undefined}
          className={cn(
            base,
            current === section.slug
              ? "border-fuchsia bg-fuchsia text-white"
              : "border-linea text-brown-text/80 hover:bg-soft-pink/40",
          )}
        >
          {section.name}
        </Link>
      ))}
    </nav>
  );
}
