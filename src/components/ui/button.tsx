import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-soft border transition-colors duration-150 ease-suave disabled:opacity-45 disabled:cursor-not-allowed select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-fucsia text-white border-fucsia hover:bg-fucsia-hover hover:border-fucsia-hover shadow-sm",
  secondary:
    "bg-transparent text-fucsia border-fucsia hover:bg-rosa-claro/50 hover:text-fucsia-hover hover:border-fucsia-hover",
  ghost:
    "bg-transparent text-vino border-transparent hover:bg-rosa-claro/30",
  danger:
    "bg-transparent text-fucsia-hover border-fucsia-hover/60 hover:bg-fucsia-hover hover:text-white hover:border-fucsia-hover",
  inverse:
    "bg-white text-fucsia border-white hover:bg-rosa-claro hover:text-fucsia-hover hover:border-rosa-claro shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  // min-h-11 = 44px, objetivo táctil mínimo
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-7 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Clases del botón, reutilizables para enlaces con el mismo aspecto. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonClassOptions = {}): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
