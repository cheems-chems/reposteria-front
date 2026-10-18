// Sello circular con texto curvo que gira lento.
export function HeroSeal() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-2 right-2 z-20 flex size-16 items-center justify-center sm:right-6 sm:size-28"
    >
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

// Héroe ilustrado: círculo fucsia grande como marco.
// Contenedor con alto/ancho acotado en móvil + overflow-hidden.
export function HeroArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mx-auto flex h-64 w-full max-w-[340px] items-center justify-center overflow-hidden sm:h-80 sm:max-w-md lg:aspect-3/2 lg:h-auto lg:max-w-none"
    >
      <span className="size-44 rounded-full bg-fucsia sm:size-64 lg:size-80" />
      <span className="absolute -left-3 top-3 z-0 size-16 animate-flotar rounded-full bg-rosa-medio sm:-left-2 sm:top-4 sm:size-28" />
      <span className="absolute bottom-4 left-2 z-0 size-12 animate-flotar-lento rounded-full bg-rosa-claro sm:bottom-6 sm:left-0 sm:size-20" />
      <HeroSeal />
    </div>
  );
}
