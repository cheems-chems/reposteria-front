import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "default" | "inverse";

const sizes: Record<LogoSize, { logo: number; tag: string; word: string }> = {
  sm: { logo: 32, tag: "text-[10px]", word: "text-2xl" },
  md: { logo: 48, tag: "text-xs", word: "text-3xl" },
  lg: { logo: 72, tag: "text-sm", word: "text-5xl sm:text-6xl" },
};

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  withTagline?: boolean;
  href?: string | null;
  className?: string;
  showImage?: boolean;
}

export function Logo({
  size = "md",
  variant = "default",
  withTagline = false,
  href = "/",
  className,
  showImage = true,
}: LogoProps) {
  const s = sizes[size];
  const color = variant === "inverse" ? "text-white" : "text-vino";
  const tagColor = variant === "inverse" ? "text-white/80" : "text-texto-suave";

  const content = (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      {showImage ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={s.logo}
          height={s.logo}
          className="h-auto w-auto"
          preload={size === "lg"}
        />
      ) : null}
      <span
        className={cn(
          "mt-1 font-serif font-semibold tracking-[-0.01em]",
          s.word,
          color,
        )}
      >
        {brand.wordmark}
      </span>
      {withTagline ? (
        <span
          className={cn(
            "mt-1 font-cursive",
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
    <Link href={href} className="inline-flex rounded-sm" aria-label={brand.name + ", " + brand.tagline}>
      {content}
    </Link>
  );
}
