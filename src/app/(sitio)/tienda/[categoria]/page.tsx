import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryNav } from '@/components/store/category-nav';
import { PageHeader } from '@/components/store/page-header';
import { ProductGrid } from '@/components/store/product-grid';
import { ButtonLink } from '@/components/ui/button-link';
import { Skeleton } from '@/components/states/skeleton';
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/api';

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
	const [category, categories, products] = await Promise.all([
		getCategoryBySlug(categoria),
		getCategories(),
		getProducts(categoria),
	]);

	if (!category) notFound();

	return (
		<>
			<PageHeader
				eyebrow="Categoría"
				title={category.name}
				description={category.description ?? undefined}
			/>

			<div className="mt-6">
				<CategoryNav categories={categories} current={category.slug} />
			</div>

			<div className="mt-8">
				<ProductGrid
					products={products}
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
