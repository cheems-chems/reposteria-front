import type { CSSProperties } from "react";
import type { SectionArtKey } from "@/components/ui/section-art";

/**
 * Partículas decorativas por sección, compartidas por el círculo del home y
 * por la tarjeta de producto. Solo transform/opacity; en móvil se muestran
 * menos para no gastar rendimiento.
 */
export interface SectionParticle {
  className: string;
  style: CSSProperties;
  /** Se oculta en móvil cuando es true. */
  desktopOnly?: boolean;
  /** Tamaño del glifo (por defecto size-4). */
  size?: string;
  /** Color propio del glifo; si falta se usa el tinta de la sección. */
  ink?: string;
}

export function sectionParticles(art: SectionArtKey): SectionParticle[] {
  if (art === "congelados") {
    // Copitos que caen despacio alrededor del círculo (2 en móvil, 6 en total).
    return [
      { className: "animate-caer", style: { top: "-2%", left: "18%", animationDelay: "0s" } },
      { className: "animate-caer", style: { top: "8%", right: "12%", animationDelay: "1.4s" } },
      { className: "animate-caer", style: { top: "0%", left: "48%", animationDelay: "2.6s" }, desktopOnly: true },
      { className: "animate-caer", style: { top: "12%", left: "4%", animationDelay: "3.4s" }, desktopOnly: true },
      { className: "animate-caer", style: { top: "18%", right: "2%", animationDelay: "4.6s" }, desktopOnly: true },
      { className: "animate-caer", style: { top: "30%", left: "30%", animationDelay: "5.6s" }, desktopOnly: true },
    ];
  }
  if (art === "salados") {
    // 3 hilitos de vapor que suben desde el ícono (2 en móvil).
    return [
      { className: "animate-vapor", style: { top: "27%", left: "44%", animationDelay: "0s" } },
      { className: "animate-vapor", style: { top: "30%", left: "51%", animationDelay: "1.5s" } },
      { className: "animate-vapor", style: { top: "26%", left: "57%", animationDelay: "3s" }, desktopOnly: true },
    ];
  }
  if (art === "dulces") {
    // Chispas de confeti (3 en móvil, 5 en total): colores sólidos y opacos
    // (amarillo, crema, blanco, chocolate) que contrastan con el círculo
    // magenta y con el fondo crema. Tres sobre el círculo, dos en los bordes.
    return [
      { className: "animate-confite", size: "size-3", ink: "text-[#FFF3E0]", style: { top: "18%", left: "22%", animationDelay: "0s" } },
      { className: "animate-confite", size: "size-4", ink: "text-mantequilla", style: { top: "30%", right: "10%", animationDelay: "1s" } },
      { className: "animate-confite", size: "size-2.5", ink: "text-tarjeta", style: { bottom: "20%", left: "12%", animationDelay: "2s" } },
      { className: "animate-confite", size: "size-3", ink: "text-[#5A1A3A]", style: { bottom: "4%", right: "8%", animationDelay: "2.8s" }, desktopOnly: true },
      { className: "animate-confite", size: "size-2", ink: "text-mantequilla", style: { top: "0%", right: "24%", animationDelay: "3.6s" }, desktopOnly: true },
    ];
  }
  return [];
}

/** Dibujos de las partículas (mismo trazo currentColor). */
export function ParticleGlyph({ art }: { art: SectionArtKey }) {
  if (art === "congelados") {
    return (
      <svg viewBox="0 0 16 16" className="size-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
        <path d="M8 2v12M3 5l10 6M13 5 3 11" />
      </svg>
    );
  }
  if (art === "dulces") {
    // Punto de confeti con un filete muy suave: se define también sobre el
    // fondo crema de la página.
    return (
      <span className="block size-full rounded-full bg-current ring-1 ring-vino/10" />
    );
  }
  // Vapor: curva fina.
  return (
    <svg viewBox="0 0 12 24" className="size-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M6 22c3-4-3-7 0-11S9 5 6 2" />
    </svg>
  );
}
