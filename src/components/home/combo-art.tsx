'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
	SectionArt,
	type SectionArtKey,
} from '@/components/ui/section-art';

/* Burbujas de fritura: nacen cerca del borde del círculo, suben con una
   pequeña deriva lateral, se achican y se desvanecen. 10 en total; las
   4 últimas solo desde sm (6 visibles en móvil). */
const BUBBLES = [
	{ size: 10, left: '14%', bottom: '16%', dur: '3.1s', delay: '0s', sx: '7px', rise: '62px' },
	{ size: 6, left: '27%', bottom: '8%', dur: '4.2s', delay: '0.6s', sx: '-5px', rise: '48px' },
	{ size: 12, left: '40%', bottom: '20%', dur: '2.6s', delay: '1.2s', sx: '4px', rise: '78px' },
	{ size: 5, left: '55%', bottom: '6%', dur: '4.5s', delay: '0.35s', sx: '-8px', rise: '44px' },
	{ size: 9, left: '70%', bottom: '22%', dur: '3.4s', delay: '1.6s', sx: '6px', rise: '70px' },
	{ size: 7, left: '82%', bottom: '38%', dur: '3.9s', delay: '0.9s', sx: '-4px', rise: '90px' },
	{ size: 11, left: '8%', bottom: '46%', dur: '2.9s', delay: '2.1s', sx: '9px', rise: '56px', desktopOnly: true },
	{ size: 4, left: '33%', bottom: '52%', dur: '4.3s', delay: '0.2s', sx: '-6px', rise: '40px', desktopOnly: true },
	{ size: 13, left: '62%', bottom: '56%', dur: '3.2s', delay: '1.4s', sx: '5px', rise: '84px', desktopOnly: true },
	{ size: 8, left: '90%', bottom: '28%', dur: '4.0s', delay: '2.6s', sx: '-7px', rise: '64px', desktopOnly: true },
];

/* Tiritas de vapor: suben, ondulan y se desvanecen. Alturas, retrasos y
   velocidades distintas, repartidas sobre el círculo. */
const VAPOR = [
	{ left: '24%', delay: '0s', dur: '4.6s', scale: '1' },
	{ left: '36%', delay: '1.1s', dur: '5.2s', scale: '0.85' },
	{ left: '45%', delay: '0.5s', dur: '4.1s', scale: '1.15' },
	{ left: '54%', delay: '1.7s', dur: '5.6s', scale: '0.9' },
	{ left: '64%', delay: '0.9s', dur: '4.8s', scale: '1.05' },
	{ left: '73%', delay: '2.2s', dur: '5s', scale: '0.8' },
	{ left: '80%', delay: '0.3s', dur: '4.4s', scale: '0.95' },
];

/* Chispitas que titilan alrededor, en dos tonos de la paleta. */
const SPARKS = [
	{ top: '16%', left: '8%', size: 4, delay: '0s' },
	{ top: '6%', right: '18%', size: 3, delay: '0.8s' },
	{ bottom: '14%', left: '18%', size: 5, delay: '1.4s' },
	{ bottom: '20%', right: '6%', size: 3, delay: '0.4s' },
	{ top: '40%', left: '2%', size: 6, delay: '1.9s' },
	{ bottom: '48%', right: '3%', size: 4, delay: '1.1s' },
];

/** Círculo amarillo del combo con animaciones de fritura, solo CSS. */
export function ComboArt({ art }: { art: SectionArtKey }) {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => setActive(entry.isIntersecting),
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			aria-hidden="true"
			className={`pointer-events-none relative flex size-60 select-none items-center justify-center sm:size-96 ${
				active ? '' : 'combo-paused'
			}`}
		>
			{/* Resplandor cálido detrás del círculo (respira) + anillo que se
			    expande y se desvanece. */}
			<span className="combo-halo absolute size-56 rounded-full blur-2xl sm:size-80" />
			<span className="combo-anillo-onda absolute size-48 rounded-full border-2 border-mantequilla/60 sm:size-72" />

			{VAPOR.map((vapor) => (
				<span
					key={vapor.left}
					className="combo-vapor absolute top-0 opacity-0"
					style={
						{
							left: vapor.left,
							'--delay': vapor.delay,
							'--dur': vapor.dur,
							'--scale': vapor.scale,
						} as CSSProperties
					}
				>
					<svg
						viewBox="0 0 24 40"
						className="h-10 w-6 text-white/60"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
					>
						<path d="M12 36 C5 30 19 24 12 18 C5 12 19 6 12 2" />
					</svg>
				</span>
			))}

			<span className="combo-pulso absolute size-56 rounded-full border-4 border-mantequilla/50 opacity-40 sm:size-80" />

			<span className="relative flex size-48 items-center justify-center rounded-full bg-mantequilla shadow-lg shadow-vino/10 sm:size-72">
				<span className="combo-chisporroteo block w-24 text-vino sm:w-36">
					<SectionArt art={art} className="w-full" />
				</span>
			</span>

			{BUBBLES.map((bubble, index) => (
				<span
					key={index}
					className={`combo-burbuja absolute rounded-full opacity-0 ${
						bubble.desktopOnly ? 'hidden sm:block ' : ''
					}${index % 2 === 0 ? 'bg-white/70' : 'bg-mantequilla/80'}`}
					style={
						{
							width: bubble.size,
							height: bubble.size,
							left: bubble.left,
							bottom: bubble.bottom,
							'--dur': bubble.dur,
							'--delay': bubble.delay,
							'--sx': bubble.sx,
							'--rise': bubble.rise,
						} as CSSProperties
					}
				/>
			))}

			{SPARKS.map((spark, index) => (
				<span
					key={index}
					className="combo-chispa absolute rounded-full bg-mantequilla opacity-0"
					style={
						{
							width: spark.size,
							height: spark.size,
							top: spark.top,
							left: spark.left,
							right: spark.right,
							bottom: spark.bottom,
							'--delay': spark.delay,
						} as CSSProperties
					}
				/>
			))}
		</div>
	);
}
