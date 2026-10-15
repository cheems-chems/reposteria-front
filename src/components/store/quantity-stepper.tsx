"use client";

import { Input } from "@/components/ui/field";

const stepButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-soft border border-linea font-sans text-xl leading-none text-brown-text transition-colors duration-200 hover:bg-soft-pink/40 disabled:cursor-not-allowed disabled:opacity-45";

interface QuantityStepperProps {
  value: number;
  /** Valor mínimo alcanzable con los botones (por defecto 0). */
  min?: number;
  /** Incremento de los botones (por defecto 1). */
  step?: number;
  /** Nombre del ítem, para las etiquetas accesibles. */
  label: string;
  invalid?: boolean;
  onChange: (value: number) => void;
}

/**
 * Selector de cantidad (−, campo, +) con paso y mínimo. El campo acepta
 * cualquier entero; los botones respetan el paso.
 */
export function QuantityStepper({
  value,
  min = 0,
  step = 1,
  label,
  invalid,
  onChange,
}: QuantityStepperProps) {
  function decrease() {
    if (value <= 0) {
      onChange(0);
      return;
    }
    const next = value - step;
    onChange(next < min ? 0 : next);
  }

  function increase() {
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
        disabled={value <= 0}
      >
        −
      </button>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
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
