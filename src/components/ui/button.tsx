import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-soft border transition-colors duration-150 ease-papel disabled:opacity-45 disabled:cursor-not-allowed select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-fuchsia text-white border-fuchsia hover:bg-fuchsia-ink hover:border-fuchsia-ink shadow-sm",
  secondary:
    "bg-transparent text-brown-text border-brown-text/70 hover:bg-soft-pink/30",
  ghost:
    "bg-transparent text-brown-text border-transparent hover:bg-soft-pink/30",
  danger:
    "bg-transparent text-fuchsia-ink border-fuchsia-ink/60 hover:bg-fuchsia-ink hover:text-white hover:border-fuchsia-ink",
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
