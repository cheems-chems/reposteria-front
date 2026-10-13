import { cn } from "@/lib/cn";

/**
 * PROVISIONAL: los estados y sus transiciones definitivos vendrán del
 * contrato del backend. Aquí solo definimos la presentación (color + texto).
 * Nunca comunicar el estado con color solo: siempre acompaña el texto.
 */
type Tone = "neutro" | "kraft" | "pistacho" | "guayaba" | "cacao" | "apagado";

const tones: Record<Tone, string> = {
  neutro: "border-linea text-tinta-suave",
  kraft: "border-kraft bg-kraft/15 text-cacao",
  pistacho: "border-pistacho bg-pistacho/20 text-cacao",
  guayaba: "border-guayaba bg-guayaba/10 text-guayaba-tinta",
  cacao: "border-cacao bg-cacao text-crema",
  apagado: "border-tinta-suave/40 text-tinta-suave",
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
