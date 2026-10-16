import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  /** Acento opcional. Máximo dos acentos por pantalla. */
  accent?: "rosa-medio" | "pistacho" | "guayaba";
  className?: string;
}

const accents = {
  "rosa-medio": "border-rosa-medio text-texto-suave",
  pistacho: "border-rosa-claro text-vino",
  guayaba: "border-fucsia text-fucsia-hover",
};

/** Rótulo pequeño de categoría, tipo etiqueta impresa. */
export function Tag({ children, accent = "rosa-medio", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-ticket border bg-tarjeta/60 px-2 py-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.14em]",
        accents[accent],
        className,
      )}
    >
      {children}
    </span>
  );
}
