"use client";

import { usePathname } from "next/navigation";

type Bubble = {
  top: string;
  side: "left" | "right";
  offset: string;
  size: string;
  color: string;
  opacity: number;
  mobileOpacity?: number;
};

// Configuración de las bolitas de fondo: top en píxeles (independiente de la
// altura del contenido), side + offset (negativo = se sale del borde),
// size/color en clases de Tailwind.
const BUBBLES: Bubble[] = [
  { top: "32px", side: "right", offset: "-3rem", size: "size-[100px] sm:size-44 lg:size-64", color: "bg-rosa-claro", opacity: 70, mobileOpacity: 0.7 },
  { top: "160px", side: "left", offset: "-3rem", size: "size-[110px] sm:size-40 lg:size-80", color: "bg-fucsia", opacity: 12, mobileOpacity: 0.3 },
  { top: "320px", side: "right", offset: "-2.5rem", size: "size-[120px] sm:size-36 lg:size-56", color: "bg-rosa-medio", opacity: 40, mobileOpacity: 0.7 },
  { top: "520px", side: "left", offset: "-3.5rem", size: "size-[130px] sm:size-56 lg:size-[420px]", color: "bg-rosa-claro", opacity: 55, mobileOpacity: 0.65 },
  { top: "760px", side: "right", offset: "-4rem", size: "size-[110px] sm:size-44 lg:size-80", color: "bg-fucsia", opacity: 12, mobileOpacity: 0.28 },
  { top: "1040px", side: "left", offset: "-3rem", size: "size-[100px] sm:size-36 lg:size-64", color: "bg-rosa-medio", opacity: 35, mobileOpacity: 0.7 },
  { top: "1360px", side: "right", offset: "-3.5rem", size: "size-[140px] sm:size-48 lg:size-[380px]", color: "bg-rosa-claro", opacity: 60, mobileOpacity: 0.7 },
  { top: "1720px", side: "left", offset: "-4rem", size: "size-[120px] sm:size-40 lg:size-72", color: "bg-fucsia", opacity: 10, mobileOpacity: 0.26 },
  { top: "2120px", side: "right", offset: "-3rem", size: "size-[110px] sm:size-32 lg:size-48", color: "bg-rosa-medio", opacity: 35, mobileOpacity: 0.7 },
  { top: "2560px", side: "left", offset: "-3.5rem", size: "size-[130px] sm:size-36 lg:size-56", color: "bg-rosa-claro", opacity: 50, mobileOpacity: 0.68 },
];

// Set propio para la Tienda: fijo a la pantalla, pocas bolitas repartidas por
// las esquinas y bordes laterales, lejos del texto.
const TIENDA_BUBBLES: Bubble[] = [
  { top: "8%", side: "right", offset: "-3rem", size: "size-[100px] sm:size-40 lg:size-56", color: "bg-rosa-claro", opacity: 70, mobileOpacity: 0.7 },
  { top: "22%", side: "left", offset: "-3rem", size: "size-[110px] sm:size-44 lg:size-64", color: "bg-fucsia", opacity: 12, mobileOpacity: 0.3 },
  { top: "44%", side: "right", offset: "-3.5rem", size: "size-[120px] sm:size-48 lg:size-72", color: "bg-rosa-medio", opacity: 40, mobileOpacity: 0.7 },
  { top: "62%", side: "left", offset: "-3.5rem", size: "size-[130px] sm:size-52 lg:size-80", color: "bg-rosa-claro", opacity: 60, mobileOpacity: 0.68 },
  { top: "82%", side: "right", offset: "-3rem", size: "size-[100px] sm:size-36 lg:size-56", color: "bg-fucsia", opacity: 10, mobileOpacity: 0.28 },
  { top: "94%", side: "left", offset: "-2.5rem", size: "size-[110px] sm:size-32 lg:size-48", color: "bg-rosa-medio", opacity: 35, mobileOpacity: 0.7 },
];

function Bubbles({
  bubbles,
  className,
}: {
  bubbles: Bubble[];
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-bubbles
      className={className}
    >
      {bubbles.map((bubble, index) => (
        <span
          key={`${bubble.side}-${bubble.top}-${index}`}
          className={`absolute rounded-full ${bubble.color} ${bubble.size}`}
          style={{
            top: bubble.top,
            left: bubble.side === "left" ? bubble.offset : undefined,
            right: bubble.side === "right" ? bubble.offset : undefined,
            opacity: `calc(var(--bubble-mobile-opacity, ${bubble.opacity / 100}) * 1)`,
          }}
        />
      ))}
      <style>{`
        @media (max-width: 767px) {
          ${bubbles.map((bubble, index) => {
            const op = bubble.mobileOpacity ?? bubble.opacity / 100;
            return `[data-bubbles] > span:nth-child(${index + 1}) { --bubble-mobile-opacity: ${op}; }`;
          }).join("\n")}
        }
      `}</style>
    </div>
  );
}

export function BackgroundBubbles() {
  const pathname = usePathname();
  const isTienda = pathname === "/tienda";

  if (isTienda) {
    return (
      <Bubbles
        bubbles={TIENDA_BUBBLES}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      />
    );
  }

  return (
    <Bubbles
      bubbles={BUBBLES}
      className="pointer-events-none absolute inset-0 overflow-x-clip"
    />
  );
}
