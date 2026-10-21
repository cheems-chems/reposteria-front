import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  SectionArt,
  sectionArtTheme,
  type SectionArtKey,
} from "@/components/ui/section-art";
import { ParticleGlyph } from "@/components/ui/section-particles";
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
  /** Carga anticipada para las primeras tarjetas visibles de portada. */
  imageLoading?: "eager" | "lazy";
  imageSizes?: string;
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
  imageLoading = "lazy",
  imageSizes = featured
    ? "(max-width: 768px) 100vw, 33vw"
    : "(max-width: 419px) calc(100vw - 2.5rem), (max-width: 639px) calc((100vw - 3.5rem) / 2), (max-width: 1023px) calc((100vw - 6rem) / 3), 16.25rem",
  action,
  className,
}: ProductTicketProps) {
  const available = product.available !== false;
  const theme = sectionArtTheme(art);

  // Gestos de la sección, SOLO al hacer hover y sobre el ícono provisional.
  const sectionGesture =
    art === "dulces"
      ? "gesto-rebote"
      : art === "congelados"
        ? "gesto-girar-lento"
        : "";

  const artPanel = (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        theme.tile,
        "transition-transform duration-[400ms] ease-suave group-hover:scale-105 motion-reduce:group-hover:scale-100",
      )}
    >
      <SectionArt
        art={art}
        className={cn(
          featured ? "w-20 sm:w-32" : "w-16 sm:w-20",
          "opacity-90",
          theme.ink,
          sectionGesture,
        )}
      />
      {art === "salados" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[20%] mx-auto h-7 w-5 text-vino/45 opacity-0 gesto-vapor"
        >
          <ParticleGlyph art="salados" />
        </span>
      ) : null}
    </span>
  );

  return (
    <div
      className={cn(
        "group levante flex flex-col rounded-soft overflow-hidden",
        theme.card,
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
            "relative m-2 overflow-hidden rounded-ticket border border-borde bg-lienzo",
            featured ? "aspect-4/3" : "aspect-4/5",
          )}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              loading={imageLoading}
              fetchPriority={imageLoading === "eager" ? "high" : "auto"}
              sizes={imageSizes}
              className={cn(
                "object-cover transition-transform duration-[400ms] ease-suave group-hover:scale-105 motion-reduce:group-hover:scale-100",
                !available && "grayscale",
              )}
            />
          ) : (
            artPanel
          )}
          {!available ? (
            <span className="absolute left-0 top-0 z-10 m-2">
              <StatusBadge label="No disponible" tone="apagado" />
            </span>
          ) : null}
          {/* Brillo diagonal: un solo paso por hover, nunca en reposo */}
          <span
            aria-hidden="true"
            className="tarjeta-brillo pointer-events-none absolute inset-0"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-1">
          {product.category ? <Tag>{product.category}</Tag> : null}
          <h3
            className={cn(
              "hyphens-auto break-words font-serif font-bold text-vino",
              featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
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
              groupPop
            />
          </div>
        </div>
      </Link>

      {action ? <div className="px-3 pb-3 pt-0">{action}</div> : null}
    </div>
  );
}
