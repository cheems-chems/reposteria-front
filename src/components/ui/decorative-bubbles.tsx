import { cn } from "@/lib/cn";

/*
  Volitas decorativas de sección: círculos rosados translúcidos, parcialmente
  cortados por los bordes. La capa se recorta a sí misma (overflow-hidden), así
  que la sección solo necesita "relative isolate" y no se recorta su contenido
  ni las sombras de los botones. Sin animaciones.

  Colores de la paleta: bg-rosa-claro (25-45%) · bg-rosa-medio (25-45%).
  Tamaños: 90-220 px en móvil; 160-380 px desde md.
*/

type Bubble = {
  /** Clases de tamaño (móvil y md) y color+opacidad. */
  className: string;
  /** Posición absoluta. Offsets negativos = parte fuera del borde. */
  style: React.CSSProperties;
  /** true = solo visible desde md (así en móvil quedan máximo 2). */
  desktopOnly?: boolean;
};

type Preset = "a" | "b" | "c" | "d";

function presetBubbles(preset: Preset): Bubble[] {
  switch (preset) {
    // "a": una grande arriba-derecha y una mediana abajo-izquierda.
    case "a":
      return [
        {
          className: "size-[200px] md:size-[340px] bg-rosa-claro/35",
          style: { top: "-4rem", right: "-5rem" },
        },
        {
          className: "size-[120px] md:size-[180px] bg-rosa-medio/30",
          style: { bottom: "-3rem", left: "-3.5rem" },
        },
        {
          className: "size-[200px] bg-rosa-medio/25",
          style: { bottom: "30%", right: "-6rem" },
          desktopOnly: true,
        },
      ];
    // "b": arriba-izquierda y abajo-derecha (alterna lado respecto a "a").
    case "b":
      return [
        {
          className: "size-[180px] md:size-[320px] bg-rosa-medio/30",
          style: { top: "-3.5rem", left: "-5rem" },
        },
        {
          className: "size-[110px] md:size-[200px] bg-rosa-claro/40",
          style: { bottom: "-2.5rem", right: "-4rem" },
        },
        {
          className: "size-[190px] bg-rosa-claro/30",
          style: { top: "35%", left: "-6rem" },
          desktopOnly: true,
        },
      ];
    // "c": dos arriba (izquierda grande + derecha media) y una abajo-derecha.
    case "c":
      return [
        {
          className: "size-[190px] md:size-[380px] bg-rosa-claro/30",
          style: { top: "-5rem", left: "-4.5rem" },
        },
        {
          className: "size-[100px] md:size-[160px] bg-rosa-medio/35",
          style: { top: "-2rem", right: "-3rem" },
        },
        {
          className: "size-[170px] bg-rosa-claro/35",
          style: { bottom: "-4rem", right: "-5rem" },
          desktopOnly: true,
        },
      ];
    // "d": arriba-derecha grande, media abajo-izquierda y una intermedia.
    case "d":
      return [
        {
          className: "size-[210px] md:size-[360px] bg-rosa-claro/30",
          style: { top: "-4.5rem", right: "-5.5rem" },
        },
        {
          className: "size-[120px] md:size-[220px] bg-rosa-medio/30",
          style: { bottom: "-3rem", left: "-4rem" },
        },
        {
          className: "size-[180px] md:size-[260px] bg-rosa-medio/25",
          style: { top: "45%", right: "-7rem" },
          desktopOnly: true,
        },
      ];
  }
}

export function DecorativeBubbles({
  preset,
  className,
}: {
  preset: Preset;
  className?: string;
}) {
  const bubbles = presetBubbles(preset);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden",
        className,
      )}
    >
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className={cn(
            "absolute rounded-full",
            bubble.className,
            bubble.desktopOnly && "hidden md:block",
          )}
          style={bubble.style}
        />
      ))}
    </div>
  );
}
