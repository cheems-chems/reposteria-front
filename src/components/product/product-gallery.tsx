'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';

interface ProductGalleryProps {
	images: string[];
	productName: string;
	fallback: ReactNode;
}

const controlClass =
	'flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-vino shadow-[0_4px_16px_rgba(90,18,51,0.16)] transition-[transform,opacity] duration-150 ease-suave hover:scale-105 hover:bg-rosa-claro active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia focus-visible:ring-offset-2 focus-visible:ring-offset-lienzo motion-reduce:transition-none';

const arrowClass =
	'shrink-0 items-center justify-center rounded-full size-11 bg-white/55 text-vino shadow-[0_2px_10px_rgba(90,18,51,0.12)] backdrop-blur-sm transition-[transform,background-color] duration-150 ease-suave hover:scale-105 hover:bg-white/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia focus-visible:ring-offset-2 focus-visible:ring-offset-lienzo motion-reduce:transition-none';

export function ProductGallery({
	images,
	productName,
	fallback,
}: ProductGalleryProps) {
	const [active, setActive] = useState(0);
	const [expanded, setExpanded] = useState(false);
	const [loadedImage, setLoadedImage] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const thumbnailsRef = useRef<HTMLDivElement>(null);
	const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const touchStartX = useRef<number | null>(null);

	useEffect(() => {
		if (images.length < 2) return;
		const container = thumbnailsRef.current;
		const thumbnail = thumbnailRefs.current[active];
		if (!container || !thumbnail) return;
		const thumbnailCenter =
			thumbnail.getBoundingClientRect().left + thumbnail.clientWidth / 2;
		const containerCenter =
			container.getBoundingClientRect().left + container.clientWidth / 2;
		const left = container.scrollLeft + thumbnailCenter - containerCenter;
		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;
		container.scrollTo({ left, behavior: reduceMotion ? 'instant' : 'smooth' });
	}, [active, images.length]);

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
		document.body.style.overflow = 'hidden';
		closeRef.current?.focus();

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				setExpanded(false);
			} else if (event.key === 'ArrowLeft') {
				event.preventDefault();
				showPrevious();
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				showNext();
			} else if (event.key === 'Tab' && dialogRef.current) {
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

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.style.overflow = previousOverflow;
			trigger?.focus();
		};
	}, [expanded, showNext, showPrevious]);

	if (images.length === 0) return <>{fallback}</>;

	const imageAlt = (index: number) => `${productName}, foto ${index + 1}`;
	const imageSizes = '(max-width: 1024px) 100vw, 60vw';
	const activeImage = images[active];

	return (
		<>
			<div className="w-full">
				<div
					className="group relative isolate aspect-square w-full"
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
						if (event.key === 'ArrowLeft') showPrevious();
						if (event.key === 'ArrowRight') showNext();
					}}
				>
					<div className="absolute left-0 top-0 size-[calc(100%-12px)]">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -inset-2 z-0 rounded-[2rem] bg-rosa-claro/65 md:-inset-3 md:rounded-[2.25rem]"
						/>
						<div className="absolute inset-0 z-10 overflow-hidden rounded-3xl border-2 border-white bg-rosa-claro/20 shadow-[0_20px_60px_rgba(90,18,51,0.12)]">
							<button
								ref={triggerRef}
								type="button"
								className="absolute inset-0 z-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fucsia"
								aria-label={`Ampliar ${imageAlt(active)}`}
								onClick={() => setExpanded(true)}
							>
								<Image
									key={activeImage}
									src={activeImage}
									alt={imageAlt(active)}
									fill
									loading={active === 0 ? 'eager' : 'lazy'}
									sizes={imageSizes}
									onLoad={() => setLoadedImage(activeImage)}
									className={`object-cover transition-opacity duration-200 motion-reduce:transition-none ${loadedImage === activeImage ? 'opacity-100' : 'opacity-0'}`}
								/>
							</button>
						</div>
					</div>
					{images.length > 1 ? (
						<>
							<button
								type="button"
								aria-label="Foto anterior"
								onClick={showPrevious}
								className={`${arrowClass} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m15 18-6-6 6-6" />
								</svg>
							</button>
							<button
								type="button"
								aria-label="Foto siguiente"
								onClick={showNext}
								className={`${arrowClass} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex`}
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-vino/75 px-2.5 py-1 font-sans text-xs text-white">
								{active + 1} / {images.length}
							</span>
						</>
					) : null}
					<button
						type="button"
						aria-label={`Ampliar ${imageAlt(active)}`}
						onClick={() => setExpanded(true)}
						className={`${controlClass} absolute right-3 top-3 z-10`}
					>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							className="size-5"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="10.8" cy="10.8" r="6.8" />
							<path d="m16 16 5 5M10.8 7.5v6.6M7.5 10.8h6.6" />
						</svg>
					</button>
				</div>

				{images.length > 1 ? (
					<div
						ref={thumbnailsRef}
						aria-label="Miniaturas de fotos"
						className="mt-4 flex snap-x gap-2.5 overflow-x-auto px-2 py-2 [scroll-padding-inline:0.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					>
						{images.map((src, index) => (
							<button
								key={src}
								ref={(node) => {
									thumbnailRefs.current[index] = node;
								}}
								type="button"
								aria-label={`Ver ${imageAlt(index)}`}
								aria-current={active === index ? 'true' : undefined}
								onClick={() => setActive(index)}
								className={`relative size-14 shrink-0 snap-start overflow-hidden rounded-2xl transition-transform duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia focus-visible:ring-offset-2 focus-visible:ring-offset-lienzo motion-reduce:transition-none sm:size-16 ${active === index ? 'scale-105 ring-2 ring-fucsia ring-offset-2 ring-offset-lienzo' : 'hover:scale-105 hover:shadow-[0_4px_16px_rgba(90,18,51,0.16)]'}`}
							>
								<Image
									src={src}
									alt=""
									fill
									sizes="(max-width: 639px) 56px, 64px"
									quality={74}
									className="object-cover"
								/>
							</button>
						))}
					</div>
				) : null}
			</div>

			{expanded && typeof document !== 'undefined'
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
