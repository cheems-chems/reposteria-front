import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-fucsia-hover">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-2 font-serif text-3xl text-vino sm:text-4xl"
      >
        {title}
      </h2>
      <span
        aria-hidden="true"
        className="mx-auto mt-3 block h-1 w-12 rounded-full bg-fucsia"
      />
      {description ? (
        <p className="mx-auto mt-4 text-base text-texto-suave">{description}</p>
      ) : null}
    </header>
  );
}

export function WaveDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("w-full overflow-hidden leading-[0]", className)}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={cn("block h-10 w-full sm:h-14", flip && "rotate-180")}
      >
        <path
          fill="currentColor"
          d="M0,30 C180,64 360,2 720,30 C1080,58 1260,2 1440,30 L1440,64 L0,64 Z"
        />
      </svg>
    </div>
  );
}

/** Franja de frases deslizándose (contenido duplicado para bucle continuo). */
export function Marquee({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "group relative flex overflow-hidden border-y border-borde bg-tarjeta py-3",
        className,
      )}
    >
      <div className="flex w-max animate-desfile">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {phrases.map((phrase) => (
              <li
                key={`${copy}-${phrase}`}
                className="flex items-center gap-4 px-6 font-serif text-lg italic text-vino/80"
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-fucsia"
                />
                {phrase}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function FloatingDots({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "puntos pointer-events-none absolute text-rosa-medio/70",
        className,
      )}
    />
  );
}

export function CheckList({
  items,
  className,
}: {
  items: { name: string; quantity: number }[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-2.5 text-vino/90">
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fucsia/10 text-fucsia"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5 10 17.5 19 6.5" />
            </svg>
          </span>
          <span className="font-sans text-sm">
            {item.name}
            <span className="tabular text-texto-suave"> · {item.quantity} u.</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
