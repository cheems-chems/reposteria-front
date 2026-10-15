import { cn } from "@/lib/cn";

type Ratio = "1/1" | "4/5" | "4/3" | "16/9";

const ratios: Record<Ratio, string> = {
  "1/1": "aspect-square",
  "4/5": "aspect-4/5",
  "4/3": "aspect-4/3",
  "16/9": "aspect-video",
};

const tints = [
  "bg-soft-pink/30",
  "bg-soft-pink/20",
  "bg-kraft/20",
  "bg-pale-pink-border/30",
];

interface PhotoPlaceholderProps {
  /** Nombre del producto que ocupa el vacío. */
  name: string;
  ratio?: Ratio;
  /** Variación determinista de color de fondo (p. ej. el id del producto). */
  seed?: number;
  /** Oculta la etiqueta "foto pendiente" (rara vez necesaria). */
  hideLabel?: boolean;
  className?: string;
}

/**
 * Estado vacío de diseño intencional: cuando el negocio aún no ha subido foto.
 * Nunca usar bloques grises ni fotos de stock presentadas como propias.
 */
export function PhotoPlaceholder({
  name,
  ratio = "4/5",
  seed = 0,
  hideLabel = false,
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        "texture-paper relative flex flex-col items-center justify-center overflow-hidden border border-linea p-4 text-center",
        ratios[ratio],
        tints[Math.abs(seed) % tints.length],
        className,
      )}
      role="img"
      aria-label={`${name} — foto pendiente`}
    >
      <svg
        viewBox="0 0 120 120"
        className="mb-3 w-16 text-brown-soft/40"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M28 76c0-7 14-11 32-11s32 4 32 11v16c0 4-14 7-32 7s-32-3-32-7z" />
        <path d="M28 76c9 5 19 7 32 7s23-2 32-7" />
        <path d="M60 38v24" />
        <path d="M60 38c2-4 6-4 7 0-1 2-4 3-7 3s-6-1-7-3c1-4 5-4 7 0z" />
      </svg>
      <p className="font-serif text-xl text-brown-text/80">{name}</p>
      {!hideLabel ? (
        <span className="mt-2 rounded-ticket border border-pale-pink-border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.18em] text-brown-soft/70">
          foto pendiente
        </span>
      ) : null}
    </div>
  );
}
