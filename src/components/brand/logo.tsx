import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "default" | "inverse";

const sizes: Record<LogoSize, { word: string; tag: string; stroke: number }> = {
  sm: { word: "text-2xl", tag: "text-[10px]", stroke: 3 },
  md: { word: "text-3xl", tag: "text-xs", stroke: 4 },
  lg: { word: "text-5xl sm:text-6xl", tag: "text-sm", stroke: 5 },
};

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  withTagline?: boolean;
  /** Si se pasa href, el logo es un enlace (por defecto a la home). */
  href?: string | null;
  className?: string;
}

/**
 * ÚNICO lugar del wordmark. Tipográfico, sin iconos ni clip-art.
 * PROVISIONAL: el texto viene de src/lib/brand.ts.
 */
export function Logo({
  size = "md",
  variant = "default",
  withTagline = false,
  href = "/",
  className,
}: LogoProps) {
  const s = sizes[size];
  const color = variant === "inverse" ? "text-crema" : "text-cacao";
  const tagColor = variant === "inverse" ? "text-kraft" : "text-tinta-suave";

  const content = (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-serif italic font-semibold tracking-[-0.02em]",
          s.word,
          color,
        )}
      >
        {brand.wordmark}
      </span>
      <svg
        viewBox="0 0 120 8"
        className="mt-1 h-2 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1 5.5C24 2.5 47 2 70 4.5c16 1.7 33 1.2 49-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={s.stroke}
          strokeLinecap="round"
          className={variant === "inverse" ? "text-kraft" : "text-kraft"}
        />
      </svg>
      {withTagline ? (
        <span
          className={cn(
            "mt-2 font-sans uppercase tracking-[0.22em]",
            s.tag,
            tagColor,
          )}
        >
          {brand.tagline}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex rounded-sm" aria-label={brand.name}>
      {content}
    </Link>
  );
}
