/*
  Volitas decorativas globales: una sola capa de fondo con círculos rosados
  translúcidos, parcialmente cortados por los bordes. Se monta una vez en el
  layout del sitio y cubre header, main y footer.

  La capa se recorta a sí misma (overflow-hidden sobre absolute inset-0), así que
  el contenedor y las secciones NO necesitan overflow-hidden y no se recortan las
  sombras de los botones. Sin animaciones.

  Colores de la paleta: bg-rosa-claro / bg-rosa-medio, con opacidad 25-45%.
  Tamaños: 90-220 px en móvil; 160-380 px desde md.
*/

type Bubble = {
  /** Clases de tamaño (móvil y md) y color+opacidad. */
  className: string;
  /** Posición: top en % + lado (izquierda/derecha) con offset fuera del borde. */
  style: React.CSSProperties;
  /** true = solo visible desde md (en móvil quedan 5 de las 8). */
  desktopOnly?: boolean;
};

const BUBBLES: Bubble[] = [
  {
    className: "size-[180px] md:size-[340px] bg-rosa-claro/35",
    style: { top: "3%", left: "-5rem" },
  },
  {
    className: "size-[140px] md:size-[260px] bg-rosa-medio/30",
    style: { top: "14%", right: "-4rem" },
  },
  {
    className: "size-[110px] md:size-[180px] bg-rosa-claro/40",
    style: { top: "27%", left: "-3.5rem" },
  },
  {
    className: "size-[200px] md:size-[380px] bg-rosa-medio/25",
    style: { top: "41%", right: "-6rem" },
  },
  {
    className: "size-[120px] md:size-[200px] bg-rosa-claro/35",
    style: { top: "56%", left: "-4rem" },
  },
  {
    className: "size-[160px] md:size-[300px] bg-rosa-medio/30",
    style: { top: "70%", right: "-5rem" },
    desktopOnly: true,
  },
  {
    className: "size-[100px] md:size-[160px] bg-rosa-claro/40",
    style: { top: "85%", left: "-3.5rem" },
    desktopOnly: true,
  },
  {
    className: "size-[130px] md:size-[220px] bg-rosa-medio/30",
    style: { top: "95%", right: "-4.5rem" },
    desktopOnly: true,
  },
];

export function PageBubbles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden"
    >
      {BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className={`absolute rounded-full ${bubble.className} ${
            bubble.desktopOnly ? "hidden md:block" : ""
          }`}
          style={bubble.style}
        />
      ))}
    </div>
  );
}
