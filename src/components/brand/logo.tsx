import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

type LogoSize = "sm" | "md" | "lg" | "header" | "footer";
type LogoVariant = "default" | "inverse";
/** "stack" apila icono y texto (por defecto); "row" los pone en una línea;
 *  "row-mobile" los pone en una línea solo por debajo de sm. */
type LogoOrientation = "stack" | "row" | "row-mobile";

const sizes: Record<
  LogoSize,
  { logo: number; img: string; tag: string; word: string }
> = {
  sm: { logo: 32, img: "size-8", tag: "text-[10px]", word: "text-2xl" },
  md: { logo: 48, img: "size-12", tag: "text-xs", word: "text-3xl" },
  lg: {
    logo: 72,
    img: "size-[72px]",
    tag: "text-sm",
    word: "text-5xl sm:text-6xl",
  },
  // Header: 56 px en móvil, 68 px en escritorio (más legible sin romper la barra).
  header: {
    logo: 68,
    img: "size-[56px] sm:size-[68px]",
    tag: "text-xs",
    word: "text-2xl",
  },
  // Footer: 56 px en móvil, 64 px en escritorio.
  footer: {
    logo: 64,
    img: "size-[56px] md:size-16",
    tag: "text-xs",
    word: "text-3xl",
  },
};

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  orientation?: LogoOrientation;
  /** Tipografía más pequeña del wordmark (útil en el header móvil). */
  compact?: boolean;
  /** Oculta el wordmark visible y deja el nombre en un texto sr-only. */
  showText?: boolean;
  withTagline?: boolean;
  href?: string | null;
  className?: string;
  showImage?: boolean;
}

export function Logo({
  size = "md",
  variant = "default",
  orientation = "stack",
  compact = false,
  showText = true,
  withTagline = false,
  href = "/",
  className,
  showImage = true,
}: LogoProps) {
  const s = sizes[size];
  const color = variant === "inverse" ? "text-white" : "text-vino";
  const tagColor = variant === "inverse" ? "text-white/80" : "text-texto-suave";
  const mobileRow = orientation === "row-mobile";
  const row = orientation === "row" || mobileRow;
  const wordClass = compact
    ? mobileRow
      ? "text-xl sm:text-2xl"
      : "text-xl"
    : s.word;

  const wordmark = (
    <span
      className={cn(
        "font-serif font-semibold tracking-[-0.01em]",
        wordClass,
        color,
        orientation === "stack" && "mt-1",
        mobileRow && "sm:mt-1",
      )}
    >
      {brand.wordmark}
    </span>
  );

  const tagline = withTagline ? (
    <span className={cn("mt-1 font-cursive", s.tag, tagColor)}>
      {brand.tagline}
    </span>
  ) : null;

  const content = (
    <span
      className={cn(
        "inline-flex leading-none",
        showText && orientation === "row" && "flex-row items-center gap-2",
        showText &&
          mobileRow &&
          "flex-row items-center gap-2 sm:flex-col sm:items-center sm:gap-0",
        showText && orientation === "stack" && "flex-col items-center",
        !showText && "items-center",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={brand.logo}
          // El nombre vive en el alt y en el texto sr-only; nunca como texto visible.
          alt={`${brand.name} — ${brand.tagline}`}
          width={s.logo}
          height={s.logo}
          // Círculo sin fondo ni cuadro, sin deformar la imagen.
          className={cn("rounded-full object-contain", s.img)}
          preload={size === "header" || size === "lg"}
        />
      ) : null}
      {showText ? (
        row && withTagline ? (
          <span className="flex flex-col items-start">
            {wordmark}
            {tagline}
          </span>
        ) : (
          <>
            {wordmark}
            {tagline}
          </>
        )
      ) : (
        <span className="sr-only">
          {brand.name} — {brand.tagline}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${brand.name} — ${brand.tagline}`}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia focus-visible:ring-offset-2 focus-visible:ring-offset-lienzo"
    >
      {content}
    </Link>
  );
}
