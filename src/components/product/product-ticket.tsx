import Link from "next/link";
import type { ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  SectionArt,
  sectionArtTheme,
  type SectionArtKey,
} from "@/components/ui/section-art";
import { SafeImage } from "@/components/ui/safe-image";
import { PriceSeal } from "@/components/ui/price-seal";
import { cn } from "@/lib/cn";

// PROVISIONAL: forma mínima; los tipos definitivos vendrán del contrato del backend (etapa 3).
export interface ProductTicketData {
  slug: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string | null;
  available?: boolean;
  compareAt?: number | null;
  featured?: boolean;
  /** Tipo de venta legible, p. ej. "Combo · 60 unidades". */
  typeLabel?: string | null;
}

interface ProductTicketProps {
  product: ProductTicketData;
  /** Dibujo de la sección/categoría para cuando no hay foto. */
  art?: SectionArtKey;
  /** Variante destacada: más grande y con otro ritmo en la rejilla. */
  featured?: boolean;
  /** Acción opcional (p. ej. "Agregar al encargo"), fuera del enlace. */
  action?: ReactNode;
  className?: string;
}

// Ficha de caja, no tarjeta redondeada con sombra; sin foto se ve el dibujo
// de su sección sobre fondo de color (nunca caja vacía ni fotos de stock).
export function ProductTicket({
  product,
  art = "casero",
  featured = false,
  action,
  className,
}: ProductTicketProps) {
  const available = product.available !== false;
  const theme = sectionArtTheme(art);

  const artPanel = (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        theme.tile,
      )}
    >
      <SectionArt
        art={art}
        className={cn("w-1/2 opacity-90", theme.ink)}
      />
    </span>
  );

  return (
    <div
      className={cn(
        "group levante flex flex-col bg-tarjeta",
        "border border-borde hover:border-vino/60",
        !available && "opacity-70",
        className,
      )}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex flex-1 flex-col"
        aria-label={`Ver ${product.name}`}
      >
        <div
          className={cn(
            "relative m-2 overflow-hidden border border-borde bg-lienzo",
            featured ? "aspect-4/3" : "aspect-4/5",
          )}
        >
          {product.imageUrl ? (
            <SafeImage
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 33vw"
                  : "(max-width: 768px) 50vw, 22vw"
              }
              className={cn(
                "object-cover transition-transform duration-200 ease-suave group-hover:scale-[1.02]",
                !available && "grayscale",
              )}
              fallback={artPanel}
            />
          ) : (
            artPanel
          )}
          {!available ? (
            <span className="absolute left-0 top-0 m-2">
              <StatusBadge label="No disponible" tone="apagado" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-1">
          {product.category ? <Tag>{product.category}</Tag> : null}
          <h3
            className={cn(
              "font-serif font-bold text-vino",
              featured ? "text-3xl" : "text-xl",
            )}
          >
            {product.name}
          </h3>
          {product.typeLabel ? (
            <p className="font-sans text-sm text-fucsia-hover">
              {product.typeLabel}
            </p>
          ) : null}
          <div className="mt-auto pt-1">
            <PriceSeal
              amount={product.price}
              compareAt={product.compareAt}
              size={featured ? "lg" : "md"}
            />
          </div>
        </div>
      </Link>

      {action ? <div className="px-3 pb-3 pt-0">{action}</div> : null}
    </div>
  );
}
