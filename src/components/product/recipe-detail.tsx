import { cn } from '@/lib/cn';

/**
 * PROVISIONAL: estos datos deben venir del backend. No inventar ingredientes
 * ni alérgenos. Si un campo llega vacío, se omite (nunca rellenar con lorem).
 */
export interface RecipeCompositionItem {
	name: string;
	quantity: number;
}

export interface RecipeData {
	description?: string | null;
	ingredients?: string[];
	allergens?: string[];
	/** Días de anticipación para el encargo, según el backend. */
	prepDays?: number | null;
	/** Composición fija de un combo (productos y cantidades). */
	composition?: RecipeCompositionItem[];
}

interface RecipeDetailProps {
	recipe: RecipeData;
	className?: string;
}

function Check() {
	return (
		<svg
			viewBox="0 0 20 20"
			aria-hidden="true"
			className="mt-0.5 size-5 shrink-0 text-fuchsia"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.4}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 10.5l4 4 8-9" />
		</svg>
	);
}

/** Detalle como ficha de recetario: composición, ingredientes, alérgenos y tiempo. */
export function RecipeDetail({ recipe, className }: RecipeDetailProps) {
	const {
		description,
		ingredients = [],
		allergens,
		prepDays,
		composition = [],
	} = recipe;

	const prepText =
		typeof prepDays === 'number' && prepDays > 0
			? `avísanos con ${prepDays} ${prepDays === 1 ? 'día' : 'días'} de anticipación`
			: 'avísanos con anticipación';

	return (
		<div className={cn('flex flex-col gap-6', className)}>
			{/* Tiempo de preparación como dato protagonista */}
			<div className="texture-paper border border-brown-text bg-brown-text px-4 py-4 text-bg">
				<p className="font-sans text-[11px] uppercase tracking-[0.2em] text-soft-pink">
					Hecho por encargo
				</p>
				<p className="mt-1 font-serif text-2xl italic leading-snug">
					Lo hacemos por encargo: {prepText}.
				</p>
			</div>

			{description ? (
				<p className="text-base leading-relaxed text-brown-text/90">{description}</p>
			) : null}

			{composition.length > 0 ? (
				<section aria-labelledby="composicion">
					<h3
						id="composicion"
						className="mb-3 flex items-center gap-2 border-b border-linea pb-1 font-serif text-xl text-brown-text"
					>
						Composición
						<span aria-hidden="true" className="text-fuchsia">♥</span>
					</h3>
					<ul className="flex flex-col gap-2">
						{composition.map((item) => (
							<li
								key={item.name}
								className="flex items-start gap-2 font-sans text-base text-brown-text/90"
							>
								<Check />
								<span>
									{item.name}
									<span className="tabular text-brown-soft">
										{' '}
										×{item.quantity}
									</span>
								</span>
							</li>
						))}
					</ul>
				</section>
			) : null}

			{ingredients.length > 0 ? (
				<section aria-labelledby="ingredientes">
					<h3
						id="ingredientes"
						className="mb-3 border-b border-linea pb-1 font-serif text-xl text-brown-text"
					>
						Ingredientes
					</h3>
					<ul className="flex flex-col gap-1.5">
						{ingredients.map((item) => (
							<li
								key={item}
								className="flex items-baseline gap-2 font-serif text-lg text-brown-text/90"
							>
								<span aria-hidden="true" className="text-fuchsia">
									—
								</span>
								{item}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{/* Alérgenos en recuadro bien visible */}
			<section aria-labelledby="alergenos">
				<div className="border-2 border-fuchsia bg-soft-pink/20 px-4 py-3">
					<h3
						id="alergenos"
						className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-fuchsia-ink"
					>
						Alérgenos
					</h3>
					{allergens && allergens.length > 0 ? (
						<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
							{allergens.map((a) => (
								<li key={a} className="font-sans text-sm text-brown-text">
									{a}
								</li>
							))}
						</ul>
					) : allergens && allergens.length === 0 ? (
						<p className="mt-1 text-sm text-brown-text/80">
							Sin alérgenos declarados.
						</p>
					) : (
						<p className="mt-1 text-sm text-brown-text/80">
							Consulta los alérgenos directamente con Elvi&apos;s.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
