import { FloatingDots, SectionHeading } from "@/components/home/decor";
import { Reveal } from "@/components/home/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import type { Review } from "@/lib/api";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      aria-label={`${rating} de 5 estrellas`}
      className="flex items-center gap-1 text-white"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          className={cn("size-4", n <= rating ? "fill-white" : "fill-white/30")}
          stroke="none"
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

// Bloque de reseñas: círculos fucsia con estrellas. Las de ejemplo solo se
// muestran en desarrollo (etiqueta EJEMPLO); si no hay ninguna, no se renderiza.
export function ReviewsBlock({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="relative overflow-x-clip border-y border-borde bg-tarjeta">
      <FloatingDots className="right-6 top-10 hidden text-fucsia/30 sm:block" />
      <span
        aria-hidden="true"
        className="absolute -left-24 bottom-0 hidden size-64 rounded-full bg-rosa-claro/50 lg:block"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <Reveal>
          <SectionHeading title="Lo que dicen de nosotros" />
        </Reveal>
        <ul className="mt-12 grid gap-10 sm:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.author} delay={index * 90}>
              <li className="flex flex-col items-center gap-4 text-center">
                <span className="flex size-28 items-center justify-center rounded-full bg-fucsia sm:size-32">
                  <Stars rating={Math.max(0, Math.min(5, review.rating))} />
                </span>
                <p className="max-w-xs font-serif text-lg italic text-vino">
                  “{review.text}”
                </p>
                <div className="flex flex-col items-center gap-2">
                  <span className="font-sans text-sm font-semibold text-texto">
                    {review.author}
                  </span>
                  {review.example ? (
                    <StatusBadge label="EJEMPLO" tone="apagado" />
                  ) : null}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
