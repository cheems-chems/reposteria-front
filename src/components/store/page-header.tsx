import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/** Encabezado de página consistente en toda la tienda. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("border-b border-linea pb-8", className)}>
      {eyebrow ? (
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-guayaba-tinta">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 font-serif text-4xl text-cacao sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-tinta-suave">{description}</p>
      ) : null}
      {children}
    </header>
  );
}
