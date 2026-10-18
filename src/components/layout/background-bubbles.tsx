type Bubble = {
  top: string;
  side: "left" | "right";
  offset: string;
  size: string;
  color: string;
  opacity: number;
  mobile?: boolean;
};

// Configuración de las bolitas de fondo: top en % de la altura de la página,
// side + offset (negativo = se sale del borde), size/color en clases de Tailwind
// y opacity en 0–100. Con mobile: false la bolita se oculta en pantallas chicas.
const BUBBLES: Bubble[] = [
  { top: "3%", side: "right", offset: "-3rem", size: "size-24 sm:size-44 lg:size-64", color: "bg-fucsia", opacity: 10, mobile: true },
  { top: "8%", side: "left", offset: "-2rem", size: "size-24 sm:size-40 lg:size-80", color: "bg-rosa-claro", opacity: 70, mobile: true },
  { top: "16%", side: "right", offset: "1rem", size: "size-20 sm:size-36 lg:size-56", color: "bg-rosa-medio", opacity: 40 },
  { top: "24%", side: "left", offset: "-4rem", size: "size-28 sm:size-56 lg:size-[420px]", color: "bg-rosa-claro", opacity: 55 },
  { top: "33%", side: "right", offset: "-5rem", size: "size-24 sm:size-44 lg:size-80", color: "bg-fucsia", opacity: 12 },
  { top: "41%", side: "left", offset: "2rem", size: "size-20 sm:size-36 lg:size-64", color: "bg-rosa-medio", opacity: 35 },
  { top: "50%", side: "right", offset: "-3rem", size: "size-20 sm:size-48 lg:size-[380px]", color: "bg-rosa-claro", opacity: 60, mobile: true },
  { top: "59%", side: "left", offset: "-4rem", size: "size-24 sm:size-40 lg:size-72", color: "bg-fucsia", opacity: 10 },
  { top: "67%", side: "right", offset: "1.5rem", size: "size-16 sm:size-32 lg:size-48", color: "bg-rosa-medio", opacity: 35 },
  { top: "75%", side: "left", offset: "-2rem", size: "size-20 sm:size-36 lg:size-56", color: "bg-rosa-claro", opacity: 50, mobile: true },
  { top: "83%", side: "right", offset: "-3rem", size: "size-16 sm:size-28 lg:size-44", color: "bg-rosa-medio", opacity: 30 },
  { top: "87%", side: "left", offset: "-1rem", size: "size-12 sm:size-24 lg:size-36", color: "bg-rosa-claro", opacity: 45, mobile: true },
];

export function BackgroundBubbles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-x-clip"
    >
      {BUBBLES.map((bubble) => (
        <span
          key={`${bubble.side}-${bubble.top}`}
          className={`absolute rounded-full ${bubble.color} ${bubble.size} ${
            bubble.mobile ? "" : "hidden sm:block"
          }`}
          style={{
            top: bubble.top,
            left: bubble.side === "left" ? bubble.offset : undefined,
            right: bubble.side === "right" ? bubble.offset : undefined,
            opacity: bubble.opacity / 100,
          }}
        />
      ))}
    </div>
  );
}
