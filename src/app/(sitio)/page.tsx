import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { ProductGrid } from '@/components/store/product-grid';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import {
	getCategories,
	getFeaturedProducts,
	getProducts,
	getStoreInfo,
} from '@/lib/api';

const steps = [
	{
		title: 'Elige lo que quieres',
		text: 'Mira el catálogo y anota sabor, tamaño y la fecha en que lo necesitas.',
	},
	{
		title: 'Cuéntanos por WhatsApp',
		text: 'Confirmamos disponibilidad y fecha de entrega según el tiempo de anticipación.',
	},
	{
		title: 'Recoge el día señalado',
		text: 'Horneamos cerca de la entrega para que llegue fresco, en tandas pequeñas.',
	},
];

export default async function HomePage() {
	const [featured, products, categories, store] = await Promise.all([
		getFeaturedProducts(),
		getProducts(),
		getCategories(),
		getStoreInfo(),
	]);

	const featuredSlug = featured[0]?.slug;

	return (
		<main className="flex flex-1 flex-col">
			{/* Hero */}
			<section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16">
				<div className="flex flex-col gap-6">
					<h1 className="max-w-3xl font-serif text-4xl italic leading-tight text-cacao sm:text-6xl">
						Lo horneamos para la fecha que importa.
					</h1>
					<p className="max-w-xl text-lg text-tinta-suave">
						{store.description}
					</p>
					<div className="flex flex-col gap-3 sm:flex-row">
						<ButtonLink href="/tienda" size="lg">
							Ver la tienda
						</ButtonLink>
						<ButtonLink href="/encargo" size="lg" variant="secondary">
							Cómo encargar
						</ButtonLink>
					</div>
				</div>
			</section>

			{/* Destacados */}
			<section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
				<div className="mb-8 flex items-end justify-between gap-4">
					<div>
						<h2 className="mt-1 font-serif text-3xl text-cacao">
							Lo más pedido
						</h2>
					</div>
					<Link
						href="/tienda"
						className="shrink-0 font-sans text-sm text-guayaba-tinta underline decoration-kraft underline-offset-4 hover:text-cacao"
					>
						Ver todo
					</Link>
				</div>
				<ProductGrid
					products={products.slice(0, 6)}
					featuredSlug={featuredSlug}
				/>
			</section>

			{/* Categorías */}
			<section className="border-t border-linea bg-papel">
				<div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
					<h2 className="font-serif text-3xl text-cacao">
						Explora por categoría
					</h2>
					<div className="mt-6 grid gap-4 sm:grid-cols-3">
						{categories.map((category) => (
							<Link
								key={category.slug}
								href={`/tienda/${category.slug}`}
								className="flex flex-col gap-2 border border-linea bg-crema p-5 transition-colors hover:border-cacao/60"
							>
								<Tag>{category.name}</Tag>
								{category.description ? (
									<p className="text-sm text-tinta-suave">
										{category.description}
									</p>
								) : null}
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Cómo funciona */}
			<section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
				<h2 className="font-serif text-3xl text-cacao">Cómo funciona</h2>
				<ol className="mt-6 grid gap-6 sm:grid-cols-3">
					{steps.map((step, index) => (
						<li key={step.title} className="flex flex-col gap-2">
							<span className="font-serif text-2xl italic text-kraft">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3 className="font-serif text-xl text-cacao">{step.title}</h3>
							<p className="text-sm text-tinta-suave">{step.text}</p>
						</li>
					))}
				</ol>
			</section>

			{/* Cierre */}
			<section className="border-t border-linea bg-cacao text-crema">
				<div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-14 sm:px-8">
					<Logo size="md" variant="inverse" />
					<p className="max-w-xl font-serif text-2xl italic leading-snug">
						¿Tienes una fecha en mente? Escríbenos y te decimos cómo llegamos.
					</p>
					<ButtonLink href="/encargo" size="lg">
						Hacer un encargo
					</ButtonLink>
				</div>
			</section>
		</main>
	);
}
