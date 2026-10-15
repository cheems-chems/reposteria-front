import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";

interface PriceSealProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  /** Precio anterior tachado (si el backend envía descuento). */
  compareAt?: number | null;
  className?: string;
}

const sizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

/**
 * Sello de precio: etiqueta de tinta guayaba con cifras tabulares.
 * El total/precio siempre es el que devuelve el servidor.
 */
export function PriceSeal({
  amount,
  size = "md",
  compareAt,
  className,
}: PriceSealProps) {
  return (
    <span className={cn("inline-flex flex-col items-start", className)}>
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-label-pink">
        Valor
      </span>
      <span className="mt-1 flex items-baseline gap-2 rounded-ticket border border-fuchsia/60 bg-soft-pink/20 px-2.5 py-1">
        <span
          className={cn(
            "tabular font-serif font-bold text-fuchsia-ink",
            sizes[size],
          )}
        >
          {formatCOP(amount)}
        </span>
        {compareAt && compareAt > amount ? (
          <span className="tabular text-sm text-brown-soft line-through">
            {formatCOP(compareAt)}
          </span>
        ) : null}
      </span>
    </span>
  );
}
