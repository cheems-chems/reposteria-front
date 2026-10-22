'use client';

import { useMemo, useState } from 'react';
import { buttonClasses } from '@/components/ui/button';
import { brand } from '@/lib/brand';
import {
	armarMensajeWhatsApp,
	calcularEstimado,
	geometriaPisos,
	moldes,
	normalizarPisos,
	type Piso,
} from '@/lib/torta-personalizada';
import { alturas } from '@/content/torta-personalizada';
import { normalizeWhatsApp, whatsappUrl } from '@/lib/whatsapp';

const money = (value: number) =>
	new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);

// Alto de CADA piso: una sola constante, igual para todos los moldes.
// Cuando alturas.enabled sea true, saldrá de alturas.options.
const DEFAULT_FLOOR_HEIGHT = 96;

// viewBox FIJO, dimensionado para el caso más grande (3 pisos de 1 libra).
// No depende de los moldes ni de la cantidad de pisos: no hay saltos ni pisos estirados.
const VB_X = 0;
const VB_Y = 362;
const VB_W = 720;
const VB_H = 340;
const BASE_Y = 660; // donde se apoya el piso 1
const CAKE_CENTER_X = 250;
const MAX_CAKE_WIDTH = 432; // ancho del piso de 1 libra
const LABEL_LINE_END = 492;
const LABEL_X = 500;

const COLORS = ['#DF78A1', '#F3A6C1', '#F9D8E4'];

export function TortaCalculadora() {
	const [count, setCount] = useState(1);
	const [pisos, setPisos] = useState<Piso[]>([{ molde: moldes[0].id }]);
	const [adjusted, setAdjusted] = useState(false);
	const normalized = useMemo(
		() => normalizarPisos(pisos).slice(0, count),
		[pisos, count],
	);
	const floorHeight = alturas.enabled
		? (alturas.options[0]?.height ?? DEFAULT_FLOOR_HEIGHT)
		: DEFAULT_FLOOR_HEIGHT;
	const geometria = useMemo(
		() => geometriaPisos(normalized, MAX_CAKE_WIDTH, floorHeight),
		[normalized, floorHeight],
	);
	const vbTop = BASE_Y - count * floorHeight - 50;
	const vbH = VB_Y + VB_H - vbTop;
	const estimado = calcularEstimado(normalized);
	const wa = normalizeWhatsApp(brand.contact.whatsapp);
	const href = wa
		? whatsappUrl(wa, armarMensajeWhatsApp(normalized, estimado))
		: undefined;

	function changeCount(next: number) {
		const n = Math.min(3, Math.max(1, next));
		setCount(n);
		setAdjusted(false);
		setPisos((current) =>
			Array.from(
				{ length: n },
				(_, i) => current[i] ?? { molde: moldes[0].id },
			),
		);
	}
	function changeMold(index: number, id: string) {
		setPisos((current) => {
			const next = [...current];
			next[index] = { molde: id };
			const fixed = normalizarPisos(next);
			setAdjusted(fixed.some((p, i) => p.molde !== next[i]?.molde));
			return fixed;
		});
	}

	return (
		<section className="my-5 w-full max-w-140 rounded-soft border border-borde bg-tarjeta p-5 shadow-sm sm:p-6">
			<div className="flex flex-col gap-5">
				<h2 className="font-serif text-2xl text-vino">
					Arma tu torta y mira cuánto cuesta más o menos
				</h2>

				<div
					className="flex w-full items-end justify-center overflow-hidden"
					style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
					role="img"
					aria-label={`Ilustración de torta de ${count} ${count === 1 ? 'piso' : 'pisos'}`}
				>
					<svg
						viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
						preserveAspectRatio="xMidYMax meet"
						className="h-full w-full"
					>
						<defs>
							<filter
								id="cake-plate-shadow"
								x="-20%"
								y="-100%"
								width="140%"
								height="300%"
							>
								<feGaussianBlur stdDeviation="5" />
							</filter>
						</defs>
						{/* Sombra suave bajo el plato */}
						<ellipse
							cx={CAKE_CENTER_X}
							cy="692"
							rx="230"
							ry="9"
							fill="#641638"
							opacity=".15"
							filter="url(#cake-plate-shadow)"
						/>
						{/* Canto del plato (el grosor) */}
						<path
							d={`M ${CAKE_CENTER_X - 236} 662 V 674 A 236 16 0 0 0 ${CAKE_CENTER_X + 236} 674 V 662 Z`}
							fill="#F3C6D6"
							stroke="#E4A5BB"
							strokeWidth="4"
							strokeLinejoin="round"
						/>
						{/* Superficie del plato */}
						<ellipse
							cx={CAKE_CENTER_X}
							cy="662"
							rx="236"
							ry="16"
							fill="#FFF4F7"
							stroke="#E4A5BB"
							strokeWidth="4"
						/>
						{/* Aro decorativo del plato */}
						<ellipse
							cx={CAKE_CENTER_X}
							cy="662"
							rx="212"
							ry="11"
							fill="none"
							stroke="#F9D8E4"
							strokeWidth="3"
						/>
						{geometria.map((piso, index) => {
							const x = CAKE_CENTER_X - piso.ancho / 2;
							const top = BASE_Y - (index + 1) * piso.alto;
							const scallops = Math.max(3, Math.round(piso.ancho / 48));
							const step = piso.ancho / scallops;
							let wave = `M ${x} ${top + 24} H ${x + piso.ancho} V ${top + 38}`;
							for (let n = scallops - 1; n >= 0; n--) {
								const right = x + (n + 1) * step;
								const left = x + n * step;
								wave += ` Q ${right - step / 2} ${top + 54} ${left} ${top + 38}`;
							}
							wave += ` L ${x} ${top + 24} Z`;
							const dots = Math.max(3, Math.floor(piso.ancho / 34));
							const labelY = top + piso.alto * 0.56;
							return (
								<g key={`${piso.molde}-${index}`}>
									<rect
										x={x}
										y={top}
										width={piso.ancho}
										height={piso.alto}
										rx="22"
										fill={COLORS[index]}
										stroke="#B52B68"
										strokeWidth="4"
									/>
									<path d={wave} fill="#FFF4F7" />
									<path
										d={`M ${x + 14} ${top + piso.alto - 28} H ${x + piso.ancho - 14}`}
										fill="none"
										stroke="#B52B68"
										strokeWidth="7"
										strokeLinecap="round"
									/>
									{Array.from({ length: dots }, (_, dot) => (
										<circle
											key={dot}
											cx={
												x +
												22 +
												dot * ((piso.ancho - 44) / Math.max(1, dots - 1))
											}
											cy={top + piso.alto - 28}
											r="5"
											fill="#F9D8E4"
										/>
									))}
									<path
										d={`M ${x + piso.ancho} ${labelY} H ${LABEL_LINE_END}`}
										fill="none"
										stroke="#B52B68"
										strokeWidth="2"
									/>
									<text
										x={LABEL_X}
										y={labelY + 11}
										fill="#641638"
										fontSize="32"
										fontWeight="600"
									>
										{piso.label}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				<div aria-live="polite">
					<p className="text-sm text-texto-suave">Precio estimado:</p>
					<p className="font-serif text-3xl font-bold text-fucsia">
						Desde ${money(estimado)}
					</p>
				</div>

				<fieldset>
					<legend className="mb-2 text-base font-semibold text-vino">
						¿Cuántos pisos quieres?
					</legend>
					<div className="grid grid-cols-3 gap-2">
						{[1, 2, 3].map((n) => (
							<button
								key={n}
								type="button"
								aria-pressed={count === n}
								onClick={() => changeCount(n)}
								className={`min-h-11 rounded-soft border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia ${
									count === n
										? 'border-fucsia bg-rosa-claro text-vino'
										: 'border-borde bg-white text-vino'
								}`}
							>
								{n}
							</button>
						))}
					</div>
				</fieldset>

				{normalized.map((piso, index) => {
					const bottom =
						index === 0
							? Infinity
							: moldes.find((m) => m.id === normalized[index - 1].molde)!.orden;
					const hasDisabled = moldes.some((m) => m.orden > bottom);
					return (
						<fieldset key={index}>
							<legend className="mb-2 text-base font-semibold text-vino">
								Piso {index + 1}
								{index === 0
									? ' (abajo)'
									: index === count - 1
										? ' (arriba)'
										: ''}
							</legend>
							<div className="grid grid-cols-3 gap-2">
								{moldes.map((molde) => (
									<button
										key={molde.id}
										type="button"
										disabled={molde.orden > bottom}
										aria-pressed={piso.molde === molde.id}
										onClick={() => changeMold(index, molde.id)}
										className={`flex min-h-12 flex-col items-center justify-center rounded-soft border px-1 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia disabled:cursor-not-allowed disabled:opacity-40 ${
											piso.molde === molde.id
												? 'border-fucsia bg-rosa-claro text-vino'
												: 'border-borde bg-white text-vino'
										}`}
									>
										<span>{molde.label}</span>
										<span className="whitespace-nowrap text-sm">
											Desde ${money(molde.price)}
										</span>
									</button>
								))}
							</div>
							{hasDisabled ? (
								<p className="mt-2 text-sm text-texto-suave">
									Este piso no puede ser más grande que el de abajo.
								</p>
							) : null}
						</fieldset>
					);
				})}

				{adjusted ? (
					<p aria-live="polite" className="text-sm text-vino">
						Ajustamos los pisos de arriba para que la torta se sostenga.
					</p>
				) : null}

				<p className="text-sm text-texto-suave">
					El diseño, los colores y la decoración los definimos por WhatsApp; el
					precio final puede variar.
				</p>

				{href ? (
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className={buttonClasses({ fullWidth: true, size: 'lg' })}
					>
						Enviar mi torta por WhatsApp
					</a>
				) : (
					<p className="text-sm text-texto-suave">
						Contáctanos por WhatsApp para enviar tu torta.
					</p>
				)}
			</div>
		</section>
	);
}
