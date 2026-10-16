import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import {
  SectionArt,
  sectionArtTheme,
  type SectionArtKey,
} from "@/components/ui/section-art";
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

// Círculo grande con identidad propia: fondo y dibujo por sección, anillo
// discontinuo girando lento detrás y el dibujo se inclina al pasar el mouse.
export function SectionCircle({
  section,
  art,
  blurb,
  productCount,
  index,
}: SectionCircleProps) {
  const theme = sectionArtTheme(art);

  return (
    <Reveal delay={index * 90}>
      <Link
        href={`/tienda?seccion=${section.slug}`}
        className="group flex flex-col items-center gap-3 text-center"
      >
        <span className="relative flex size-36 items-center justify-center sm:size-48 lg:size-52">
          <svg
            viewBox="0 0 100 100"
            className={cn(
              "animate-anillo pointer-events-none absolute -inset-2",
              theme.ring,
            )}
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
              "relative flex size-full items-center justify-center overflow-hidden rounded-full border-4",
              theme.tile,
              theme.edge,
            )}
          >
            {section.imageUrl ? (
              <SafeImage
                src={section.imageUrl}
                alt={section.name}
                fill
                sizes="(max-width: 640px) 11rem, (max-width: 1024px) 12rem, 13rem"
                className="object-cover"
                fallback={
                  <SectionArt
                    art={art}
                    className={cn(
                      "w-16 transition-transform duration-300 ease-suave group-hover:-rotate-6 sm:w-20 lg:w-24",
                      theme.ink,
                    )}
                  />
                }
              />
            ) : (
              <SectionArt
                art={art}
                className={cn(
                  "w-16 transition-transform duration-300 ease-suave group-hover:-rotate-6 sm:w-20 lg:w-24",
                  theme.ink,
                )}
              />
            )}
          </span>

          <span
            aria-label={`${productCount} productos`}
            className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-lienzo bg-vino font-serif text-base text-white sm:size-10 sm:text-lg"
          >
            {productCount}
          </span>
        </span>

        <span className={cn("font-serif text-lg font-bold sm:text-xl", theme.title)}>
          {section.name}
        </span>
        <span className={cn("max-w-[11rem] text-xs sm:max-w-[13rem] sm:text-sm", theme.body)}>
          {blurb}
        </span>
        <span className={cn("font-sans text-sm font-semibold", theme.link)}>
          Ver todo →
        </span>
      </Link>
    </Reveal>
  );
}
