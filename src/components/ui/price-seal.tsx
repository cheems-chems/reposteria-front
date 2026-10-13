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
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "tabular font-serif font-semibold text-guayaba-tinta",
          sizes[size],
        )}
      >
        {formatCOP(amount)}
      </span>
      {compareAt && compareAt > amount ? (
        <span className="tabular text-sm text-tinta-suave line-through">
          {formatCOP(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
