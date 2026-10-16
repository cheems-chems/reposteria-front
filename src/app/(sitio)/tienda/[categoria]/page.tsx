import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SectionNav } from '@/components/store/section-nav';
import { PageHeader } from '@/components/store/page-header';
import { ProductGrid } from '@/components/store/product-grid';
import { ButtonLink } from '@/components/ui/button-link';
import { Skeleton } from '@/components/states/skeleton';
import { categorySaleKind } from '@/lib/encargo';
import { getCategories, getCategoryBySlug, getComboItems, getProducts, getSections } from '@/lib/api';

type CategoriaParams = Promise<{ categoria: string }>;

export async function generateStaticParams() {
	const categories = await getCategories();
	return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: CategoriaParams;
}): Promise<Metadata> {
	const { categoria } = await params;
	const category = await getCategoryBySlug(categoria);
	if (!category) return { title: 'Categoría no encontrada' };
	return {
		title: category.name,
		description: category.description ?? undefined,
	};
}

/** Placeholder del App Shell: mismo contorno que el listado final. */
function CategoriaFallback() {
	return (
		<div className="flex flex-col gap-8">
			<Skeleton className="h-24 w-full" />
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, index) => (
					<Skeleton key={index} className="aspect-4/5 w-full" />
				))}
			</div>
		</div>
	);
}

async function CategoriaContenido({ params }: { params: CategoriaParams }) {
	const { categoria } = await params;
	const [category, products, sections, comboItems] = await Promise.all([
		getCategoryBySlug(categoria),
		getProducts(categoria),
		getSections(),
		getComboItems(),
	]);

	if (!category) notFound();

	const kind = categorySaleKind(products);
	const ctaLabel =
		kind === 'pack'
			? 'Elegir bandejas'
			: kind === 'empty'
				? null
				: 'Hacer encargo';

	return (
		<>
			<PageHeader
				eyebrow="Categoría"
				title={category.name}
				description={category.description ?? undefined}
			>
				{ctaLabel ? (
					<ButtonLink
						href={`/encargo?categoria=${category.slug}`}
						className="mt-6"
					>
						{ctaLabel}
					</ButtonLink>
				) : null}
			</PageHeader>

			<div className="mt-6 flex flex-col gap-3">
				{sections.length > 0 ? (
					<SectionNav sections={sections} current={category.sectionSlug ?? null} />
				) : null}
				<div>
					<ButtonLink href="/tienda" variant="ghost" size="sm">
						← Volver a la tienda
					</ButtonLink>
				</div>
			</div>

			<div className="mt-8">
				<ProductGrid
					products={products}
					comboItems={comboItems}
					emptyTitle="Todavía no hay productos en esta categoría"
					emptyAction={
						<ButtonLink href="/tienda" variant="secondary" size="sm">
							Ver todo el catálogo
						</ButtonLink>
					}
				/>
			</div>
		</>
	);
}

export default function CategoriaPage({ params }: { params: CategoriaParams }) {
	return (
		<main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
			<Suspense fallback={<CategoriaFallback />}>
				<CategoriaContenido params={params} />
			</Suspense>
		</main>
	);
}
