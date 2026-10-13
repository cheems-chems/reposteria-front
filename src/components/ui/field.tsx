import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/* --- Field: etiqueta + control + error por campo --------------------------- */

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="font-sans text-sm font-medium text-cacao"
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-guayaba-tinta" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-tinta-suave">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-guayaba-tinta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* --- Controles base -------------------------------------------------------- */

const control =
  "w-full rounded-(--radius-soft) border border-linea bg-papel px-3.5 py-2.5 font-sans text-base text-cacao placeholder:text-tinta-suave/60 transition-colors duration-200 focus:border-cacao focus:outline-none aria-invalid:border-guayaba-tinta";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(control, "min-h-11", className)} {...props} />;
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(control, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn(control, "min-h-11 pr-8", className)} {...props}>
      {children}
    </select>
  );
}
