import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClasses } from "./button";
import type { ButtonSize, ButtonVariant } from "./button";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** Enlace con el aspecto exacto de un botón (navegación, no acción). */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
