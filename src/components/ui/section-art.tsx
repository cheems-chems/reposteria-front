/**
 * Dibujos SVG hechos a mano (sin imágenes, nada de stock); el emparejador por
 * slugs es solo estética y no decide datos ni filtrados.
 */

export type SectionArtKey = "dulces" | "salados" | "congelados" | "casero";

/** Patrones de emparejamiento (slugs y nombres vienen en minúsculas/no importa). */
const ART_PATTERNS: Array<[SectionArtKey, RegExp]> = [
  ["dulces", /dulce|torta|bizcoch|postre|cake|dessert|sweet/],
  ["salados", /salad|combo|empana|dedito|pasaboca|snack|carne|queso/],
  ["congelados", /congel|bandeja|helad|frozen|frit|hielo/],
];

/** Clave visual a partir de slugs o nombres; solo elige dibujo, nunca filtra datos. */
export function sectionArtKey(
  ...values: Array<string | null | undefined>
): SectionArtKey {
  const value = values.filter(Boolean).join(" ").toLowerCase();
  if (!value) return "casero";
  for (const [key, pattern] of ART_PATTERNS) {
    if (pattern.test(value)) return key;
  }
  return "casero";
}

/**
 * Identidad de color por sección: SOLO el círculo y su dibujo cambian. Los
 * textos (título, descripción y enlace) son fijos y no dependen del círculo,
 * así que viven en el componente, no aquí.
 */
export interface SectionArtTheme {
  /** Fondo del círculo/panel. */
  tile: string;
  /** Color del dibujo (trazo con currentColor). */
  ink: string;
  /** Fondo de la tarjeta de producto: degradado de la sección hacia blanco. */
  card: string;
}

export function sectionArtTheme(key: SectionArtKey): SectionArtTheme {
  switch (key) {
    case "dulces":
      return {
        tile: "bg-fucsia",
        ink: "text-white",
        card: "bg-linear-to-b from-rosa-claro/50 to-tarjeta",
      };
    case "salados":
      return {
        tile: "bg-mantequilla",
        ink: "text-vino",
        card: "bg-linear-to-b from-mantequilla/30 to-tarjeta",
      };
    case "congelados":
      return {
        tile: "bg-hielo",
        ink: "text-azul-oscuro",
        card: "bg-linear-to-b from-hielo/35 to-tarjeta",
      };
    default:
      return { tile: "bg-tarjeta", ink: "text-fucsia", card: "bg-tarjeta" };
  }
}

/** Dibujo de la sección, a mano, en trazo (currentColor, sin relleno).
 *  `className` es obligatorio: todo svg necesita tamaño explícito (w-/size-);
 *  sin eso el svg se estira al 100% del contenedor. */
export function SectionArt({
  art,
  className,
}: {
  art: SectionArtKey;
  className: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {art === "dulces" ? (
        <>
          {/* Rebanada de torta: glaseado y cereza con relleno; líneas en blanco */}
          <path d="M75 58 L98 58 L98 46 Z" className="fill-lienzo" />
          <path d="M18 90 L98 90 L98 46 Z" />
          <path d="M47 74 L98 74" />
          <path d="M75 58 L98 58" />
          <circle cx="95" cy="38" r="6.5" className="fill-fucsia" />
          <path d="M95 31.5 c 1.5 -6 6 -8.5 10.5 -7.5" />
        </>
      ) : art === "salados" ? (
        <>
          {/* Dedito relleno detrás + empanada con repulgue de festón */}
          <g transform="rotate(-18 40 44)">
            <rect x="14" y="35" width="52" height="18" rx="9" />
            <path d="M26 44 H54" />
          </g>
          <path d="M26 84 A34 34 0 0 1 94 84 q -8.5 8 -17 0 q -8.5 8 -17 0 q -8.5 8 -17 0 q -8.5 8 -17 0 Z" />
        </>
      ) : art === "congelados" ? (
        <>
          {/* Copo de nieve: seis brazos con ramitas y centro */}
          {[0, 60, 120].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 60 60)`}>
              <path d="M60 22 L60 98" />
              <path d="M52 33 L60 25 L68 33" />
              <path d="M52 87 L60 95 L68 87" />
            </g>
          ))}
          <circle cx="60" cy="60" r="7" />
        </>
      ) : (
        <>
          {/* Neutro: corazón de la casa con un destello */}
          <path d="M60 88 C 42 74 30 64 30 51 C 30 41 37 34.5 46 34.5 C 52 34.5 57 37.5 60 43 C 63 37.5 68 34.5 74 34.5 C 83 34.5 90 41 90 51 C 90 64 78 74 60 88 Z" />
          <path d="M95 40 l 2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5 Z" />
        </>
      )}
    </svg>
  );
}
