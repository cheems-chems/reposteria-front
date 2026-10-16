import { cn } from "@/lib/cn";

/**
 * PROVISIONAL: los estados y sus transiciones definitivos vendrán del
 * contrato del backend. Aquí solo definimos la presentación (color + texto).
 * Nunca comunicar el estado con color solo: siempre acompaña el texto.
 */
type Tone = "neutro" | "rosa-medio" | "pistacho" | "guayaba" | "cacao" | "apagado";

const tones: Record<Tone, string> = {
  neutro: "border-borde text-texto-suave",
  "rosa-medio": "border-rosa-medio bg-rosa-medio/15 text-vino",
  pistacho: "border-rosa-claro bg-rosa-claro/20 text-vino",
  guayaba: "border-fucsia bg-rosa-claro/30 text-fucsia-hover",
  cacao: "border-vino bg-vino text-white",
  apagado: "border-texto-suave/40 text-texto-suave",
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ label, tone = "neutro", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-ticket border px-2 py-0.5 font-sans text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
