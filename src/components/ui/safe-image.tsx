"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Se muestra si la foto no existe o falla al cargar. */
  fallback?: ReactNode;
}

function isRenderableSrc(src: string): boolean {
  return src.startsWith("/") || src.startsWith("http");
}

// next/image rompe la página con src inválido; aquí una foto rota cae en el fallback.
export function SafeImage({
  src,
  alt,
  fill,
  sizes,
  className,
  priority,
  fallback,
}: SafeImageProps) {
  const [failed, setFailed] = useState(() => !isRenderableSrc(src));

  if (failed) return <>{fallback ?? null}</>;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
