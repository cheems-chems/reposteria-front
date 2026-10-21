"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  fallback: ReactNode;
}

const controlClass =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-borde bg-lienzo text-vino shadow-sm transition-colors duration-150 ease-suave hover:bg-rosa-claro active:bg-rosa-medio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia focus-visible:ring-offset-2 focus-visible:ring-offset-lienzo motion-reduce:transition-none";

export function ProductGallery({
  images,
  productName,
  fallback,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const showPrevious = useCallback(() => {
    setActive((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);
  const showNext = useCallback(() => {
    setActive((index) => (index + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!expanded) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpanded(false);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [expanded, showNext, showPrevious]);

  if (images.length === 0) return <>{fallback}</>;

  const imageAlt = (index: number) => `${productName}, foto ${index + 1}`;
  const imageSizes = "(max-width: 1024px) 100vw, 60vw";

  return (
    <>
      <div>
        <div
          className="group relative aspect-4/3 w-full overflow-hidden bg-lienzo"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null || images.length < 2) return;
            const delta = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 45) {
              if (delta > 0) showPrevious();
              else showNext();
            }
            touchStartX.current = null;
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            className="absolute inset-0 z-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fucsia"
            aria-label={`Ampliar ${imageAlt(active)}`}
            onClick={() => setExpanded(true)}
          >
            <Image
              src={images[active]}
              alt={imageAlt(active)}
              fill
              priority={active === 0}
              sizes={imageSizes}
              className="object-cover"
            />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={showPrevious}
                className={`${controlClass} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-80 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100`}
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={showNext}
                className={`${controlClass} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-80 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100`}
              >
                <span aria-hidden="true">→</span>
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div
            aria-label="Miniaturas de fotos"
            className="flex snap-x gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Ver ${imageAlt(index)}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`relative size-16 shrink-0 snap-start overflow-hidden rounded-soft border-2 transition-colors motion-reduce:transition-none ${active === index ? "border-fucsia" : "border-borde hover:border-fucsia/60"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {expanded && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-vino/95 p-4 text-white sm:p-8"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setExpanded(false);
              }}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={`Galería de ${productName}`}
                className="relative flex h-[85vh] max-h-full w-full max-w-6xl flex-col items-center gap-4"
              >
                <div className="flex w-full items-center justify-between">
                  <p aria-live="polite" className="font-sans text-sm tabular">
                    {active + 1} / {images.length}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Cerrar vista ampliada"
                    onClick={() => setExpanded(false)}
                    className="flex size-11 items-center justify-center rounded-full border border-white/50 text-2xl text-white transition-colors hover:bg-white/10 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia motion-reduce:transition-none"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="relative min-h-0 w-full flex-1">
                  <Image
                    src={images[active]}
                    alt={imageAlt(active)}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
                {images.length > 1 ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      aria-label="Foto anterior"
                      onClick={showPrevious}
                      className="flex size-11 items-center justify-center rounded-full border border-white/50 text-xl text-white transition-colors hover:bg-white/10 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia motion-reduce:transition-none"
                    >
                      <span aria-hidden="true">←</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Foto siguiente"
                      onClick={showNext}
                      className="flex size-11 items-center justify-center rounded-full border border-white/50 text-xl text-white transition-colors hover:bg-white/10 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia motion-reduce:transition-none"
                    >
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
