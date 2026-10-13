import type { ReactNode } from "react";
import { ProductTicket } from "@/components/product/product-ticket";
import { EmptyState } from "@/components/states/empty-state";
import type { ProductListItem } from "@/lib/api";

interface ProductGridProps {
  products: ProductListItem[];
  /** Slug que debe ocupar el doble de ancho (ficha destacada). */
  featuredSlug?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

/**
 * Rejilla de productos reutilizable. No muestra nada inventado: si no hay
 * productos, cae en un estado vacío con mensaje útil.
 */
export function ProductGrid({
  products,
  featuredSlug,
  emptyTitle = "Todavía no hay productos aquí",
  emptyDescription = "Estamos preparando el catálogo. Vuelve pronto o escríbenos para un encargo.",
  emptyAction,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const ticket = (
          <ProductTicket
            featured={product.slug === featuredSlug}
            product={{
              slug: product.slug,
              name: product.name,
              price: product.price,
              category: product.categoryName,
              imageUrl: product.imageUrl,
              available: product.available,
              compareAt: product.compareAt,
              featured: product.featured,
            }}
            className="h-full"
          />
        );

        return product.slug === featuredSlug ? (
          <div key={product.slug} className="col-span-2">
            {ticket}
          </div>
        ) : (
          <div key={product.slug}>{ticket}</div>
        );
      })}
    </div>
  );
}
