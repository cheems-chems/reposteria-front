import { SectionArt } from "@/components/ui/section-art";

// Sello circular con texto curvo que gira lento.
function HeroSeal() {
  return (
    <span className="absolute -bottom-2 right-2 flex size-24 items-center justify-center sm:right-6 sm:size-28">
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
      <span className="absolute text-xl text-fucsia" aria-hidden="true">
        ♥
      </span>
    </span>
  );
}

// Héroe ilustrado: los dibujos del catálogo flotan sobre un círculo fucsia
// grande. Sin fotos de stock; si hay foto real, la reemplaza la imagen.
export function HeroArt() {
  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-3/2 w-full items-center justify-center"
    >
      <span className="absolute size-48 rounded-full bg-fucsia sm:size-64 lg:size-80" />
      <span className="absolute -left-2 top-4 size-20 animate-flotar rounded-full bg-rosa-medio sm:size-28" />
      <span className="absolute bottom-6 left-0 size-14 animate-flotar-lento rounded-full bg-rosa-claro sm:size-20" />

      <SectionArt
        art="dulces"
        className="absolute left-[12%] top-[10%] w-20 text-white sm:w-28 animate-flotar"
      />
      <SectionArt
        art="salados"
        className="absolute bottom-[12%] right-[10%] w-24 text-white sm:w-32 animate-flotar-lento"
      />
      <SectionArt
        art="congelados"
        className="absolute right-[16%] top-[8%] w-14 text-white/90 sm:w-20 animate-flotar"
      />
      <SectionArt
        art="casero"
        className="absolute bottom-[14%] left-[18%] w-12 text-white/90 sm:w-16 animate-flotar-lento"
      />

      <HeroSeal />
    </div>
  );
}
