import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Category } from "@/lib/api";

const base =
  "whitespace-nowrap rounded-(--radius-soft) border px-3 py-1.5 font-sans text-sm transition-colors";

/** Filtro de categorías como enlaces (sin estado en el cliente). */
export function CategoryNav({
  categories,
  current,
}: {
  categories: Category[];
  current?: string;
}) {
  return (
    <nav aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
      <Link
        href="/tienda"
        aria-current={!current ? "page" : undefined}
        className={cn(
          base,
          !current
            ? "border-cacao bg-cacao text-crema"
            : "border-linea text-cacao/80 hover:bg-crema-hondo",
        )}
      >
        Todo
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/tienda/${category.slug}`}
          aria-current={current === category.slug ? "page" : undefined}
          className={cn(
            base,
            current === category.slug
              ? "border-cacao bg-cacao text-crema"
              : "border-linea text-cacao/80 hover:bg-crema-hondo",
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
