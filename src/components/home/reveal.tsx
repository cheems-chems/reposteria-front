"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Retardo en ms para escalonar la aparición. */
  delay?: number;
  className?: string;
}

/**
 * Aparición suave al entrar en el viewport (IntersectionObserver sobre el
 * DOM, sin estado de React). Respeta `prefers-reduced-motion`: en ese caso el
 * contenido aparece de inmediato.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      node.dataset.shown = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.shown = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "translate-y-5 opacity-0 transition-all duration-500 ease-suave",
        "data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100",
        "motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
