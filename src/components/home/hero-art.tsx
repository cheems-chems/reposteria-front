import { SectionArt } from "@/components/ui/section-art";

// Sello circular con texto curvo que gira lento.
function HeroSeal() {
  return (
    <span className="absolute bottom-2 right-2 z-0 flex size-16 items-center justify-center sm:right-6 sm:size-28">
      <svg
        viewBox="0 0 100 100"
        className="animate-sello size-full"
        aria-hidden="true"
      >
        <defs>
          <path
            id="sello-texto"
            d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0"
          />
        </defs>
        <circle cx="50" cy="50" r="49" fill="white" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#D6195F"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        <text
          fill="#5A1233"
          fontSize="9.5"
          fontFamily="var(--font-nunito), sans-serif"
          fontWeight="700"
          letterSpacing="1.5"
        >
          <textPath href="#sello-texto">
            HECHO EN CASA · HECHO EN CASA ·
          </textPath>
        </text>
      </svg>
      <span className="absolute text-base text-fucsia sm:text-xl" aria-hidden="true">
        ♥
      </span>
    </span>
  );
}

// Héroe ilustrado: los dibujos del catálogo flotan sobre un círculo fucsia
// grande. Sin fotos de stock; si hay foto real, la reemplaza la imagen.
// Contenedor con alto/ancho acotado en móvil + overflow-hidden: ningún dibujo
// puede salirse ni montarse sobre el texto y los botones del héroe.
export function HeroArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mx-auto flex h-64 w-full max-w-[340px] items-center justify-center overflow-hidden sm:h-80 sm:max-w-md lg:aspect-3/2 lg:h-auto lg:max-w-none"
    >
      <span className="size-44 rounded-full bg-fucsia sm:size-64 lg:size-80" />
      <span className="absolute -left-3 top-3 z-0 size-16 animate-flotar rounded-full bg-rosa-medio sm:-left-2 sm:top-4 sm:size-28" />
      <span className="absolute bottom-4 left-2 z-0 size-12 animate-flotar-lento rounded-full bg-rosa-claro sm:bottom-6 sm:left-0 sm:size-20" />

      <SectionArt
        art="dulces"
        className="absolute left-[6%] top-[6%] z-0 w-16 animate-flotar text-white sm:left-[12%] sm:top-[10%] sm:w-28"
      />
      <SectionArt
        art="salados"
        className="absolute bottom-[8%] left-[5%] z-0 w-20 animate-flotar-lento text-white sm:bottom-[12%] sm:left-auto sm:right-[10%] sm:w-32"
      />
      <SectionArt
        art="congelados"
        className="absolute right-[8%] top-[8%] z-0 w-12 animate-flotar text-white/90 sm:right-[16%] sm:w-20"
      />
      <SectionArt
        art="casero"
        className="absolute bottom-[6%] left-[42%] z-0 w-10 animate-flotar-lento text-white/90 sm:bottom-[14%] sm:left-[18%] sm:w-16"
      />

      <HeroSeal />
    </div>
  );
}
