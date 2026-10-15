import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { PriceSeal } from "@/components/ui/price-seal";
import { cn } from "@/lib/cn";

/**
 * PROVISIONAL: forma mínima que consumirá la ficha pública. Los tipos
 * definitivos se derivarán del contrato del backend (etapa 3).
 */
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
  className?: string;
}

/**
 * Ficha/etiqueta de caja: foto con borde de papel, nombre en serif y precio
 * en sello. No es una tarjeta redondeada con sombra.
 */
export function ProductTicket({
  product,
  featured = false,
  className,
}: ProductTicketProps) {
  const available = product.available !== false;
  const ratio = featured ? "4/3" : "4/5";

  return (
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        "group flex flex-col bg-papel transition-colors duration-200 ease-papel",
        "border border-linea hover:border-brown-text/60",
        !available && "opacity-70",
        className,
      )}
    >
      <div className="relative m-2 overflow-hidden border border-linea bg-bg">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 22vw"}
            className={cn(
              "object-cover transition-transform duration-300 ease-papel group-hover:scale-[1.02]",
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
            "font-serif font-bold text-brown-text",
            featured ? "text-3xl" : "text-xl",
          )}
        >
          {product.name}
        </h3>
        {product.typeLabel ? (
          <p className="font-sans text-sm text-label-pink">
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
  );
}
