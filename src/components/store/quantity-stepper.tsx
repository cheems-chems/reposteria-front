"use client";

import { Input } from "@/components/ui/field";

const stepButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-soft border border-borde font-sans text-xl leading-none text-vino transition-colors duration-200 hover:bg-rosa-claro/40 disabled:cursor-not-allowed disabled:opacity-45";

interface QuantityStepperProps {
  value: number;
  min?: number;
  step?: number;
  /** Nombre del ítem, para las etiquetas accesibles. */
  label: string;
  invalid?: boolean;
  /** Bloquea el "−" aunque la cantidad sea mayor que 0 (p. ej. mínimo global). */
  disableDecrease?: boolean;
  /** Normaliza la cantidad manual al salir del campo. */
  normalizeInput?: (value: number) => number;
  nextIncrease?: (value: number) => number;
  nextDecrease?: (value: number) => number;
  onChange: (value: number) => void;
}

/** El campo acepta cualquier entero; los botones respetan el paso y el mínimo. */
export function QuantityStepper({
  value,
  min = 0,
  step = 1,
  label,
  invalid,
  disableDecrease,
  normalizeInput,
  nextIncrease,
  nextDecrease,
  onChange,
}: QuantityStepperProps) {
  function decrease() {
    if (value <= min) {
      onChange(0);
      return;
    }
    if (nextDecrease) {
      onChange(nextDecrease(value));
      return;
    }
    const next = value - step;
    onChange(next < min ? min : next);
  }

  function increase() {
    if (nextIncrease) {
      onChange(nextIncrease(value));
      return;
    }
    if (value <= 0) {
      onChange(Math.max(min, step));
      return;
    }
    onChange(value + step);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className={stepButton}
        aria-label={`Quitar cantidad de ${label}`}
        onClick={decrease}
        disabled={value <= 0 || disableDecrease}
      >
        −
      </button>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={value > 0 ? String(value) : ""}
        aria-label={`Cantidad de ${label}`}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(0);
            return;
          }
          const parsed = Math.floor(Number(raw));
          if (Number.isNaN(parsed)) return;
          onChange(Math.max(0, parsed));
        }}
        onBlur={() => {
          if (!normalizeInput) return;
          const normalized = normalizeInput(value);
          if (normalized !== value) onChange(normalized);
        }}
        className="w-14 px-1 text-center"
      />
      <button
        type="button"
        className={stepButton}
        aria-label={`Agregar cantidad de ${label}`}
        onClick={increase}
      >
        +
      </button>
    </div>
  );
}
