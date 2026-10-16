import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { PriceSeal } from "@/components/ui/price-seal";
import { cn } from "@/lib/cn";

/** PROVISIONAL: forma mínima; los tipos definitivos vendrán del contrato del backend (etapa 3). */
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

function seedFrom(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}

interface ProductTicketProps {
  product: ProductTicketData;
  /** Variante destacada: más grande y con otro ritmo en la rejilla. */
  featured?: boolean;
  /** Acción opcional (p. ej. "Agregar al encargo"), fuera del enlace. */
  action?: ReactNode;
  className?: string;
}

/**
 * Ficha de caja, no tarjeta redondeada con sombra; la acción va debajo del
 * enlace para no anidar botones dentro de un enlace.
 */
export function ProductTicket({
  product,
  featured = false,
  action,
  className,
}: ProductTicketProps) {
  const available = product.available !== false;
  const ratio = featured ? "4/3" : "4/5";

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
        <div className="relative m-2 overflow-hidden border border-borde bg-lienzo">
          {product.imageUrl ? (
            <Image
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
            />
          ) : (
            <PhotoPlaceholder
              name={product.name}
              ratio={ratio}
              seed={seedFrom(product.slug)}
              className="border-0"
            />
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
