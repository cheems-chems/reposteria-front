import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductTicket } from "@/components/product/product-ticket";
import { EmptyState } from "@/components/states/empty-state";
import { orderLineForProduct, productPrice, productTypeLabel } from "@/lib/encargo";
import type { BuilderItemProduct, ProductListItem } from "@/lib/api";

interface ProductGridProps {
  products: ProductListItem[];
  /** Ítems de armador para resolver la composición de los combos. */
  comboItems?: BuilderItemProduct[];
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
  comboItems = [],
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
        const line = product.available
          ? orderLineForProduct(product, comboItems)
          : null;
        const ticket = (
          <ProductTicket
            featured={product.slug === featuredSlug}
            product={{
              slug: product.slug,
              name: product.name,
              price: productPrice(product),
              category: product.categoryName,
              imageUrl: product.imageUrl,
              available: product.available,
              compareAt: product.compareAt,
              featured: product.featured,
              typeLabel: productTypeLabel(product),
            }}
            action={
              line ? (
                <AddToCartButton line={line} size="sm" fullWidth />
              ) : undefined
            }
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
