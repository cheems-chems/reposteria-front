"use client";

import { useCart } from "@/components/cart/cart-provider";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import type { OrderLine } from "@/lib/api";

interface AddToCartButtonProps {
  /** Línea de encargo ya calculada (con precio estimado). */
  line: OrderLine;
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

/** Agrega una línea al carrito y abre el panel "Mi encargo". */
export function AddToCartButton({
  line,
  label = "Agregar al encargo",
  size = "sm",
  variant = "primary",
  fullWidth = false,
  className,
}: AddToCartButtonProps) {
  const { add } = useCart();

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      onClick={() => add(line)}
    >
      {label}
    </Button>
  );
}
