import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import {
  SectionArt,
  sectionArtTheme,
  type SectionArtKey,
} from "@/components/ui/section-art";
import {
  ParticleGlyph,
  sectionParticles,
} from "@/components/ui/section-particles";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/cn";
import type { Section } from "@/lib/api";

interface SectionCircleProps {
  section: Section;
  art: SectionArtKey;
  blurb: string;
  /** Número real de productos de la sección (calculado, no inventado). */
  productCount: number;
  index: number;
}

/** Texto del enlace de cada sección en "Compra por sección". */
const linkTextBySection: Record<string, string> = {
  dulces: "Ver tortas y postres",
  salados: "Ver pasabocas",
  congelados: "Ver congelados",
};

// Cículo grande con identidad propia: SOLO el fondo y el dibujo cambian por
// sección. Las partículas y el anillo giran/mueven con transform y opacity.
export function SectionCircle({
  section,
  art,
  blurb,
  productCount,
  index,
}: SectionCircleProps) {
  const theme = sectionArtTheme(art);
  const particles = sectionParticles(art);
  const particleInk =
    art === "congelados"
      ? "text-azul-oscuro/70"
      : art === "salados"
        ? "text-vino/35"
        : "text-fucsia/70";

  return (
    <Reveal delay={index * 90}>
      <Link
        href={`/tienda?seccion=${section.slug}`}
        className={cn(
          "group flex w-full max-w-52 flex-col items-center gap-3 text-center",
          "transition-transform duration-300 ease-suave hover:-translate-y-1.5",
          "motion-reduce:hover:translate-y-0",
        )}
      >
        <span className="relative flex size-36 shrink-0 items-center justify-center sm:size-40 lg:size-52">
          <svg
            viewBox="0 0 100 100"
            className="animate-anillo pointer-events-none absolute -inset-2 text-fucsia/30"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeDasharray="3.5 6"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="48.5" />
          </svg>

          <span
            className={cn(
              "relative flex size-full items-center justify-center overflow-hidden rounded-full border-4 border-white/70",
              theme.tile,
            )}
          >
            {section.imageUrl ? (
              <SafeImage
                src={section.imageUrl}
                alt={section.name}
                fill
                sizes="(max-width: 640px) 9rem, (max-width: 1024px) 10rem, 13rem"
                className="object-cover"
                fallback={
                  <SectionArt
                    art={art}
                    className={cn(
                      "w-16 transition-transform duration-300 ease-suave group-hover:-rotate-6 motion-reduce:group-hover:rotate-0 sm:w-20 lg:w-24",
                      theme.ink,
                      art === "congelados" && "animate-girar-lento motion-reduce:animate-none",
                      art === "dulces" && "animate-rebote motion-reduce:animate-none",
                    )}
                  />
                }
              />
            ) : (
              <SectionArt
                art={art}
                className={cn(
                  "w-16 transition-transform duration-300 ease-suave group-hover:-rotate-6 motion-reduce:group-hover:rotate-0 sm:w-20 lg:w-24",
                  theme.ink,
                  art === "congelados" && "animate-girar-lento motion-reduce:animate-none",
                  art === "dulces" && "animate-rebote motion-reduce:animate-none",
                )}
              />
            )}
          </span>

          {/* Partículas DESPUÉS del círculo, encima de él y (en Dulces) también
              del badge, sin capturar clics */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0",
              art === "dulces" ? "z-30" : "z-10",
            )}
          >
            {particles.map((particle, i) => (
              <span
                key={i}
                className={cn(
                  "absolute block",
                  particle.size ?? "size-4",
                  particle.ink ?? particleInk,
                  particle.className,
                  particle.desktopOnly && "hidden sm:block",
                )}
                style={particle.style}
              >
                <ParticleGlyph art={art} />
              </span>
            ))}
          </span>

          <span
            aria-label={`${productCount} productos`}
            className="absolute -right-1 -top-1 z-20 flex size-8 items-center justify-center rounded-full border-2 border-lienzo bg-vino font-serif text-base text-white sm:size-10 sm:text-lg"
          >
            {productCount}
          </span>
        </span>

        <span className="flex min-h-24 flex-col items-center gap-2">
          <span className="font-serif text-lg font-bold text-vino sm:text-xl">
            {section.name}
          </span>
          <span className="max-w-44 text-sm text-texto-suave sm:max-w-52 sm:text-base">
            {blurb}
          </span>
        </span>
        <span className="font-sans text-sm font-semibold text-fucsia-hover">
          {linkTextBySection[section.slug] ?? "Ver todo"} →
        </span>
      </Link>
    </Reveal>
  );
}
