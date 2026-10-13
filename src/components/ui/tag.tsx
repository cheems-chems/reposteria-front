import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  /** Acento opcional. Máximo dos acentos por pantalla. */
  accent?: "kraft" | "pistacho" | "guayaba";
  className?: string;
}

const accents = {
  kraft: "border-kraft text-tinta-suave",
  pistacho: "border-pistacho text-cacao",
  guayaba: "border-guayaba text-guayaba-tinta",
};

/** Rótulo pequeño de categoría, tipo etiqueta impresa. */
export function Tag({ children, accent = "kraft", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-ticket border bg-papel/60 px-2 py-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.14em]",
        accents[accent],
        className,
      )}
    >
      {children}
    </span>
  );
}
