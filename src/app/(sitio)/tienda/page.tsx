import type { Metadata } from "next";
import { CategoryNav } from "@/components/store/category-nav";
import { PageHeader } from "@/components/store/page-header";
import { ProductGrid } from "@/components/store/product-grid";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Catálogo de tortas, bizcochos y postres hechos por encargo.",
};

export default async function TiendaPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Catálogo"
        title="Tienda"
        description="Elige una categoría o mira todo. Cada producto se hornea por encargo: revisa el tiempo de anticipación en su ficha."
      />

      <div className="mt-6">
        <CategoryNav categories={categories} />
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
