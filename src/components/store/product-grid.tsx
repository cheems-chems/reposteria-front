import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Reveal } from "@/components/home/reveal";
import { ProductTicket } from "@/components/product/product-ticket";
import { EmptyState } from "@/components/states/empty-state";
import { sectionArtKey } from "@/components/ui/section-art";
import { orderLineForProduct, productPrice, productTypeLabel } from "@/lib/encargo";
import { cn } from "@/lib/cn";
import type { BuilderItemProduct, ProductListItem } from "@/lib/api";
import { getCardImage } from "@/lib/galeria";

/** Retardo de entrada: 60 ms por paso, máximo 8 pasos (420 ms). */
const STAGGER_STEP_MS = 60;
const STAGGER_STEPS = 8;

interface ProductGridProps {
  products: ProductListItem[];
  /** Ítems de armador para resolver la composición de los combos. */
  comboItems?: BuilderItemProduct[];
  /** Slug que debe ocupar el doble de ancho (ficha destacada). */
  featuredSlug?: string;
  /**
   * Filtro activo (p. ej. la sección). Entra al key de cada tarjeta para que,
   * al cambiar de filtro, las visibles vuelvan a entrar con Reveal.
   */
  entranceKey?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

/** Rejilla reutilizable; sin productos cae en un estado vacío con mensaje útil. */
export function ProductGrid({
  products,
  comboItems = [],
  featuredSlug,
  entranceKey = "",
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

  const cardImages = products.map((product) =>
    getCardImage(product.slug, product.imageUrl),
  );

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => {
        const line = product.available
          ? orderLineForProduct(product, comboItems)
          : null;
        const ticket = (
          <ProductTicket
            featured={product.slug === featuredSlug}
            art={sectionArtKey(product.categorySlug, product.categoryName)}
            product={{
              slug: product.slug,
              name: product.name,
              price: productPrice(product),
              category: product.categoryName,
              imageUrl: cardImages[index] ?? null,
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

        return (
          <Reveal
            key={`${entranceKey}::${product.slug}`}
            delay={
              Math.min(index, STAGGER_STEPS - 1) * STAGGER_STEP_MS
            }
            className={cn(
              "h-full",
              product.slug === featuredSlug && "min-[420px]:col-span-2",
            )}
          >
            {ticket}
          </Reveal>
        );
      })}
    </div>
  );
}
