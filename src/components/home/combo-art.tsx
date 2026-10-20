'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
	SectionArt,
	type SectionArtKey,
} from '@/components/ui/section-art';

const BUBBLES = [
	{ size: 8, left: '12%', bottom: '22%', dur: '3.6s', delay: '0s' },
	{ size: 6, left: '28%', bottom: '12%', dur: '4.4s', delay: '0.6s' },
	{ size: 10, left: '46%', bottom: '18%', dur: '3.9s', delay: '1.2s' },
	{ size: 5, left: '62%', bottom: '8%', dur: '4.8s', delay: '0.4s' },
	{ size: 7, left: '78%', bottom: '24%', dur: '3.4s', delay: '1.6s' },
	{ size: 9, left: '86%', bottom: '42%', dur: '4.2s', delay: '0.9s' },
	{ size: 6, left: '8%', bottom: '48%', dur: '5s', delay: '2s' },
];

const VAPOR = [
	{ left: '30%', delay: '0s' },
	{ left: '42%', delay: '1.1s' },
	{ left: '55%', delay: '0.5s' },
	{ left: '67%', delay: '1.7s' },
];

const SPARKS = [
	{ top: '16%', left: '8%', size: 3, sx: '6px', delay: '0s' },
	{ top: '6%', right: '18%', size: 2, sx: '-5px', delay: '0.8s' },
	{ bottom: '14%', left: '18%', size: 2, sx: '4px', delay: '1.4s' },
	{ bottom: '20%', right: '6%', size: 3, sx: '-6px', delay: '0.4s' },
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
			{VAPOR.map((vapor) => (
				<span
					key={vapor.left}
					className="combo-vapor absolute top-0 opacity-0"
					style={
						{
							left: vapor.left,
							'--delay': vapor.delay,
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
						index % 2 === 0 ? 'bg-white/70' : 'bg-mantequilla/80'
					}`}
					style={
						{
							width: bubble.size,
							height: bubble.size,
							left: bubble.left,
							bottom: bubble.bottom,
							'--dur': bubble.dur,
							'--delay': bubble.delay,
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
							'--sx': spark.sx,
							'--delay': spark.delay,
						} as CSSProperties
					}
				/>
			))}
		</div>
	);
}
