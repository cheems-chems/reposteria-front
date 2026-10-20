"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";
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

/** Confirmación visual local (1.5 s); no toca la lógica del carrito. */
const FEEDBACK_MS = 1500;

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
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleClick = () => {
    add(line);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), FEEDBACK_MS);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      className={cn("presion active:scale-[0.97]", className)}
      onClick={handleClick}
    >
      <span aria-live="polite" className="inline-flex items-center gap-1.5">
        {added ? (
          <span className="animate-pop font-bold">
            ✓ Agregado
          </span>
        ) : (
          label
        )}
      </span>
    </Button>
  );
}
