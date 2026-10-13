import { cn } from '@/lib/cn';

/**
 * PROVISIONAL: estos datos deben venir del backend. No inventar ingredientes
 * ni alérgenos. Si un campo llega vacío, se omite (nunca rellenar con lorem).
 */
export interface RecipeData {
	description?: string | null;
	ingredients?: string[];
	allergens?: string[];
	/** Días de anticipación para el encargo, según el backend. */
	prepDays?: number | null;
}

interface RecipeDetailProps {
	recipe: RecipeData;
	className?: string;
}

/** Detalle como ficha de recetario: ingredientes, alérgenos y tiempo. */
export function RecipeDetail({ recipe, className }: RecipeDetailProps) {
	const { description, ingredients = [], allergens, prepDays } = recipe;

	const prepText =
		typeof prepDays === 'number' && prepDays > 0
			? `avísanos con ${prepDays} ${prepDays === 1 ? 'día' : 'días'} de anticipación`
			: 'avísanos con anticipación';

	return (
		<div className={cn('flex flex-col gap-6', className)}>
			{/* Tiempo de preparación como dato protagonista */}
			<div className="texture-paper border border-cacao bg-cacao px-4 py-4 text-crema">
				<p className="font-sans text-[11px] uppercase tracking-[0.2em] text-kraft">
					Hecho por encargo
				</p>
				<p className="mt-1 font-serif text-2xl italic leading-snug">
					Lo horneamos por encargo: {prepText}.
				</p>
			</div>

			{description ? (
				<p className="text-base leading-relaxed text-cacao/90">{description}</p>
			) : null}

			{ingredients.length > 0 ? (
				<section aria-labelledby="ingredientes">
					<h3
						id="ingredientes"
						className="mb-3 border-b border-linea pb-1 font-serif text-xl text-cacao"
					>
						Ingredientes
					</h3>
					<ul className="flex flex-col gap-1.5">
						{ingredients.map((item) => (
							<li
								key={item}
								className="flex items-baseline gap-2 font-serif text-lg text-cacao/90"
							>
								<span aria-hidden="true" className="text-kraft">
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
				<div className="border-2 border-guayaba bg-guayaba/5 px-4 py-3">
					<h3
						id="alergenos"
						className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-guayaba-tinta"
					>
						Alérgenos
					</h3>
					{allergens && allergens.length > 0 ? (
						<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
							{allergens.map((a) => (
								<li key={a} className="font-sans text-sm text-cacao">
									{a}
								</li>
							))}
						</ul>
					) : allergens && allergens.length === 0 ? (
						<p className="mt-1 text-sm text-cacao/80">
							Sin alérgenos declarados.
						</p>
					) : (
						<p className="mt-1 text-sm text-cacao/80">
							Consulta los alérgenos directamente con la repostería.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
