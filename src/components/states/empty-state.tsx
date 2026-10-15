import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Lista vacía con mensaje útil y acción clara (no un simple "sin datos"). */
export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "texture-paper flex flex-col items-center justify-center gap-3 border border-dashed border-linea bg-papel/60 px-6 py-14 text-center",
        className,
      )}
    >
      <svg
        viewBox="0 0 120 60"
        className="w-20 text-brown-text/30"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M18 46h84" />
        <path d="M30 46V30h60v16" />
        <path d="M30 30c0-8 13-14 30-14s30 6 30 14" />
      </svg>
      <h3 className="font-serif text-2xl text-brown-text">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-brown-soft">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
