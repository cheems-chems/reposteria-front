/*
  Volitas decorativas globales: una sola capa de fondo con círculos rosados
  translúcidos, parcialmente cortados por los bordes. Se monta una vez en el
  layout del sitio y cubre header, main y footer.

  La capa se recorta a sí misma (overflow-hidden sobre absolute inset-0), así que
  el contenedor y las secciones NO necesitan overflow-hidden y no se recortan las
  sombras de los botones. Sin animaciones.

  Dos tonos, de arriba hacia abajo: clara, clara, clara, oscura, clara, oscura,
  oscura, clara. Clara = rosa claro (30-35%). Oscura = rosa medio (35-50%), más
  marcada pero sin llegar al fucsia.
  Tamaños: 90-220 px en móvil; 160-380 px desde md.

  Las clases van como literales completos (Tailwind no extrae nombres construidos).
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
  // 1 · clara
  {
    className: "size-[180px] md:size-[340px] bg-rosa-claro/35",
    style: { top: "3%", left: "-5rem" },
  },
  // 2 · clara
  {
    className: "size-[140px] md:size-[260px] bg-rosa-claro/30",
    style: { top: "14%", right: "-4rem" },
  },
  // 3 · clara
  {
    className: "size-[110px] md:size-[180px] bg-rosa-claro/35",
    style: { top: "27%", left: "-3.5rem" },
  },
  // 4 · oscura
  {
    className: "size-[160px] md:size-[340px] bg-rosa-medio/40",
    style: { top: "41%", right: "-5.5rem" },
  },
  // 5 · clara
  {
    className: "size-[120px] md:size-[200px] bg-rosa-claro/35",
    style: { top: "56%", left: "-4rem" },
  },
  // 6 · oscura
  {
    className: "size-[150px] md:size-[300px] bg-rosa-medio/38",
    style: { top: "70%", right: "-6rem" },
    desktopOnly: true,
  },
  // 7 · oscura
  {
    className: "size-[90px] md:size-[160px] bg-rosa-medio/45",
    style: { top: "85%", left: "-5.5rem" },
    desktopOnly: true,
  },
  // 8 · clara
  {
    className: "size-[130px] md:size-[220px] bg-rosa-claro/30",
    style: { top: "95%", right: "-4.5rem" },
    desktopOnly: true,
  },
  // Nuevas volitas medianas y pequeñas, intercaladas entre las grandes.
  // 9 · clara, mediana
  {
    className: "size-[96px] md:size-[112px] bg-rosa-claro/35",
    style: { top: "8%", right: "2%" },
  },
  // 10 · clara, pequeña
  {
    className: "size-[40px] md:size-[48px] bg-rosa-claro/35",
    style: { top: "20%", left: "3%" },
  },
  // 11 · intensa, mediana
  {
    className: "size-[72px] md:size-[88px] bg-rosa-medio/50",
    style: { top: "33%", right: "1%" },
  },
  // 12 · clara, pequeña
  {
    className: "size-[32px] md:size-[40px] bg-rosa-claro/35",
    style: { top: "47%", left: "4%" },
  },
  // 13 · clara, mediana
  {
    className: "size-[104px] md:size-[128px] bg-rosa-claro/35",
    style: { top: "61%", right: "2%" },
    desktopOnly: true,
  },
  // 14 · intensa, pequeña
  {
    className: "size-[48px] md:size-[56px] bg-rosa-medio/50",
    style: { top: "75%", left: "3%" },
    desktopOnly: true,
  },
  // 15 · clara, mediana
  {
    className: "size-[88px] md:size-[104px] bg-rosa-claro/35",
    style: { top: "89%", right: "2%" },
    desktopOnly: true,
  },
  // 16 · intensa, mediana
  {
    className: "size-[64px] md:size-[80px] bg-rosa-medio/50",
    style: { top: "25%", left: "2%" },
    desktopOnly: true,
  },
  // 17 · clara, pequeña
  {
    className: "size-[28px] md:size-[36px] bg-rosa-claro/35",
    style: { top: "40%", right: "4%" },
    desktopOnly: true,
  },
  // 18 · clara, mediana
  {
    className: "size-[120px] md:size-[136px] bg-rosa-claro/35",
    style: { top: "52%", left: "1%" },
    desktopOnly: true,
  },
  // 19 · intensa, pequeña
  {
    className: "size-[40px] md:size-[48px] bg-rosa-medio/50",
    style: { top: "67%", right: "3%" },
    desktopOnly: true,
  },
  // 20 · clara, pequeña
  {
    className: "size-[52px] md:size-[56px] bg-rosa-claro/35",
    style: { top: "81%", right: "1%" },
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
