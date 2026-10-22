import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionNav } from "@/components/store/section-nav";
import { PageHeader } from "@/components/store/page-header";
import { ProductGrid } from "@/components/store/product-grid";
import { Skeleton } from "@/components/states/skeleton";
import {
  getCategories,
  getComboItems,
  getProducts,
  getSections,
} from "@/lib/api";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Cupcakes, tortas personalizadas, pasabocas y bandejas congeladas hechos en casa.",
};

type TiendaSearchParams = Promise<{ seccion?: string | string[] }>;

function TiendaFallback() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-11 w-80" />
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-4/5 w-full" />
        ))}
      </div>
    </div>
  );
}

async function TiendaContenido({
  searchParams,
}: {
  searchParams: TiendaSearchParams;
}) {
  const [params, products, categories, sections, comboItems] =
    await Promise.all([
      searchParams,
      getProducts(),
      getCategories(),
      getSections(),
      getComboItems(),
    ]);

  const raw = params.seccion;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const section = sections.find((item) => item.slug === requested) ?? null;
  const sectionSlug = section?.slug ?? null;

  const shownCategories = sectionSlug
    ? categories.filter((category) => category.sectionSlug === sectionSlug)
    : categories;
  const allowed = new Set(shownCategories.map((category) => category.slug));
  const shownProducts = sectionSlug
    ? products.filter((product) => allowed.has(product.categorySlug))
    : products;

  const productsByCategory = new Map<string, typeof shownProducts>();
  for (const product of shownProducts) {
    const list = productsByCategory.get(product.categorySlug);
    if (list) {
      list.push(product);
    } else {
      productsByCategory.set(product.categorySlug, [product]);
    }
  }

  const orderedCategories = shownCategories.filter((category) =>
    productsByCategory.has(category.slug),
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionNav sections={sections} current={sectionSlug} />
      {orderedCategories.map((category) => (
        <div key={category.slug} className="flex flex-col gap-3">
          <h2 className="font-serif text-xl text-vino">
            {category.name}
          </h2>
          <ProductGrid
            products={productsByCategory.get(category.slug) ?? []}
            comboItems={comboItems}
            entranceKey={sectionSlug ?? "todo"}
          />
        </div>
      ))}
    </div>
  );
}

export default function TiendaPage({
  searchParams,
}: {
  searchParams: TiendaSearchParams;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        title="Tienda"
        description="Elige una sección, o mira todo. Cada producto se hace por encargo: revisa el tiempo de anticipación en su ficha."
      />

      <div className="mt-6">
        <Suspense fallback={<TiendaFallback />}>
          <TiendaContenido searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
