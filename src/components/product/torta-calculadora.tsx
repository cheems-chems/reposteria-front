'use client';

import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { buttonClasses } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/field';
import { brand } from '@/lib/brand';
import {
	armarMensajeWhatsApp,
	calcularEstimado,
	fechaHoyISO,
	geometriaPisos,
	moldes,
	normalizarPisos,
	validarDatosPedido,
	type DatosPedido,
	type ErroresDatosPedido,
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

type DatosFormulario = {
	nombre: string;
	correo: string;
	fecha: string;
	entrega: DatosPedido['entrega'];
	direccion: string;
	notas: string;
};

const DATOS_INICIALES: DatosFormulario = {
	nombre: '',
	correo: '',
	fecha: '',
	entrega: 'recoger',
	direccion: '',
	notas: '',
};

const sinSuscripcion = () => () => {};
const hoyCliente = () => fechaHoyISO();
const hoyServidor = () => '';

export function TortaCalculadora() {
	const [count, setCount] = useState(1);
	const [pisos, setPisos] = useState<Piso[]>([{ molde: moldes[0].id }]);
	const [adjusted, setAdjusted] = useState(false);
	const [datos, setDatos] = useState<DatosFormulario>(DATOS_INICIALES);
	const [errores, setErrores] = useState<ErroresDatosPedido>({});
	const hoy = useSyncExternalStore(sinSuscripcion, hoyCliente, hoyServidor);
	const nombreRef = useRef<HTMLInputElement>(null);
	const correoRef = useRef<HTMLInputElement>(null);
	const fechaRef = useRef<HTMLInputElement>(null);
	const direccionRef = useRef<HTMLInputElement>(null);

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
	const estimado = calcularEstimado(normalized);
	const wa = normalizeWhatsApp(brand.contact.whatsapp);
	const datosPedido: DatosPedido = {
		nombre: datos.nombre,
		correo: datos.correo || undefined,
		fecha: datos.fecha,
		entrega: datos.entrega,
		direccion: datos.direccion || undefined,
		notas: datos.notas || undefined,
	};
	const datosValidos =
		Object.keys(validarDatosPedido(datosPedido)).length === 0;
	const href =
		wa && datosValidos
			? whatsappUrl(wa, armarMensajeWhatsApp(normalized, estimado, datosPedido))
			: undefined;

	function actualizarDato<K extends keyof DatosFormulario>(
		campo: K,
		valor: DatosFormulario[K],
	) {
		setDatos((actual) => ({ ...actual, [campo]: valor }));
		setErrores((actual) => {
			if (!actual[campo]) return actual;
			const siguiente = { ...actual };
			delete siguiente[campo];
			return siguiente;
		});
	}

	function elegirEntrega(entrega: DatosPedido['entrega']) {
		setDatos((actual) => ({ ...actual, entrega }));
		setErrores((actual) => {
			if (!actual.entrega && !(entrega === 'recoger' && actual.direccion)) {
				return actual;
			}
			const siguiente = { ...actual };
			delete siguiente.entrega;
			if (entrega === 'recoger') delete siguiente.direccion;
			return siguiente;
		});
	}

	function enviar(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const siguientes = validarDatosPedido(datosPedido);
		setErrores(siguientes);
		if (Object.keys(siguientes).length > 0) {
			const primerCampo = (
				['nombre', 'fecha', 'direccion', 'correo'] as const
			).find((campo) => siguientes[campo]);
			const refs = {
				nombre: nombreRef,
				fecha: fechaRef,
				direccion: direccionRef,
				correo: correoRef,
			};
			if (primerCampo) refs[primerCampo].current?.focus();
			return;
		}
		if (!wa) return;
		window.open(
			whatsappUrl(wa, armarMensajeWhatsApp(normalized, estimado, datosPedido)),
			'_blank',
			'noopener,noreferrer',
		);
	}

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

				<form noValidate onSubmit={enviar} className="flex flex-col gap-4">
					<section
						aria-labelledby="datos-pedido-titulo"
						className="flex flex-col gap-4 border-t border-borde pt-5"
					>
						<div>
							<p className="text-sm font-semibold text-fucsia-hover">
								Tus datos
							</p>
							<h3
								id="datos-pedido-titulo"
								className="mt-1 font-serif text-xl text-vino"
							>
								Cuéntanos para cuándo la quieres
							</h3>
						</div>

						<Field
							label="Nombre"
							htmlFor="datos-nombre"
							hint="Para saber cómo llamarte."
							error={errores.nombre}
							required
						>
							<Input
								ref={nombreRef}
								id="datos-nombre"
								name="nombre"
								autoComplete="name"
								value={datos.nombre}
								onChange={(e) => actualizarDato('nombre', e.target.value)}
								placeholder="Tu nombre"
								aria-invalid={Boolean(errores.nombre)}
								aria-describedby={
									errores.nombre ? 'datos-nombre-error' : 'datos-nombre-hint'
								}
							/>
						</Field>

						<Field
							label="Correo (opcional)"
							htmlFor="datos-correo"
							hint="Si quieres que te escriba por ahí."
							error={errores.correo}
						>
							<Input
								ref={correoRef}
								id="datos-correo"
								name="correo"
								type="email"
								autoComplete="email"
								inputMode="email"
								value={datos.correo}
								onChange={(e) => actualizarDato('correo', e.target.value)}
								placeholder="tucorreo@ejemplo.com"
								aria-invalid={Boolean(errores.correo)}
								aria-describedby={
									errores.correo ? 'datos-correo-error' : 'datos-correo-hint'
								}
							/>
						</Field>

						<Field
							label="Fecha en que la necesitas"
							htmlFor="datos-fecha"
							hint="De hoy en adelante."
							error={errores.fecha}
							required
						>
							<Input
								ref={fechaRef}
								id="datos-fecha"
								name="fecha"
								type="date"
								min={hoy || undefined}
								value={datos.fecha}
								onChange={(e) => actualizarDato('fecha', e.target.value)}
								className="min-w-0"
								aria-invalid={Boolean(errores.fecha)}
								aria-describedby={
									errores.fecha ? 'datos-fecha-error' : 'datos-fecha-hint'
								}
							/>
						</Field>

						<fieldset
							className="flex flex-col gap-1.5"
							aria-describedby={
								errores.entrega ? 'datos-entrega-error' : 'datos-entrega-hint'
							}
						>
							<legend className="font-sans text-sm font-medium text-vino">
								¿Cómo la quieres?
							</legend>
							<div className="grid grid-cols-2 gap-2">
								{(
									[
										{ valor: 'recoger', label: 'La recojo' },
										{ valor: 'domicilio', label: 'A domicilio' },
									] as const
								).map((opcion) => (
									<button
										key={opcion.valor}
										type="button"
										aria-pressed={datos.entrega === opcion.valor}
										onClick={() => elegirEntrega(opcion.valor)}
										className={`min-h-11 rounded-soft border px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia ${
											datos.entrega === opcion.valor
												? 'border-fucsia bg-rosa-claro text-vino'
												: 'border-borde bg-white text-vino'
										}`}
									>
										{opcion.label}
									</button>
								))}
							</div>
							{errores.entrega ? (
								<p
									id="datos-entrega-error"
									className="text-xs font-medium text-fucsia-hover"
								>
									{errores.entrega}
								</p>
							) : (
								<p id="datos-entrega-hint" className="text-xs text-texto-suave">
									Si eliges domicilio, te pedimos la dirección.
								</p>
							)}
						</fieldset>

						{datos.entrega === 'domicilio' ? (
							<Field
								label="Dirección de entrega"
								htmlFor="datos-direccion"
								hint="Calle, número y barrio."
								error={errores.direccion}
								required
							>
								<Input
									ref={direccionRef}
									id="datos-direccion"
									name="direccion"
									autoComplete="street-address"
									value={datos.direccion}
									onChange={(e) => actualizarDato('direccion', e.target.value)}
									placeholder="Calle 1 #2-3, barrio"
									aria-invalid={Boolean(errores.direccion)}
									aria-describedby={
										errores.direccion
											? 'datos-direccion-error'
											: 'datos-direccion-hint'
									}
								/>
							</Field>
						) : null}

						<Field
							label="¿Algo más que quieras contarnos?"
							htmlFor="datos-notas"
							hint="La ocasión, ideas, colores o el mensaje de la torta."
						>
							<Textarea
								id="datos-notas"
								name="notas"
								rows={3}
								value={datos.notas}
								onChange={(e) => actualizarDato('notas', e.target.value)}
								placeholder="Es para un cumpleaños, me gustaría con flores…"
								aria-describedby="datos-notas-hint"
							/>
						</Field>
					</section>

					<div className="flex flex-col gap-2">
						{href ? (
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className={buttonClasses({ fullWidth: true, size: 'lg' })}
							>
								Enviar mi torta por WhatsApp
							</a>
						) : wa ? (
							<button
								type="submit"
								className={buttonClasses({ fullWidth: true, size: 'lg' })}
							>
								Enviar mi torta por WhatsApp
							</button>
						) : (
							<p className="text-sm text-texto-suave">
								Contáctanos por WhatsApp para enviar tu torta.
							</p>
						)}
						{wa ? (
							<p className="text-sm text-texto-suave">
								Al enviar, se abre WhatsApp con tu torta y tus datos; Elvi te
								confirma el diseño y el precio final.
							</p>
						) : null}
					</div>
				</form>
			</div>
		</section>
	);
}
