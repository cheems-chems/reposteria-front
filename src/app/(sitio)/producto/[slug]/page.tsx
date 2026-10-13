import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeDetail } from "@/components/product/recipe-detail";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { PriceSeal } from "@/components/ui/price-seal";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/states/skeleton";
import { useProvisionalData } from "@/lib/api";
import { getProductBySlug, getProducts } from "@/lib/api";

type ProductoParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: ProductoParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
  };
}

function seedFrom(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return hash;
}

/** Placeholder del App Shell: mismo contorno que la ficha final. */
function ProductoFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-11 w-3/4" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

async function ProductoDetalle({ params }: { params: ProductoParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <nav aria-label="Ruta" className="mb-6 flex flex-wrap gap-2 text-sm text-tinta-suave">
        <Link className="hover:text-cacao" href="/tienda">
          Tienda
        </Link>
        <span aria-hidden="true">/</span>
        <Link className="hover:text-cacao" href={`/tienda/${product.categorySlug}`}>
          {product.categoryName}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Media */}
        <div className="relative overflow-hidden border border-linea bg-crema">
          {product.imageUrl ? (
            <div className="relative aspect-4/3">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          ) : (
            <PhotoPlaceholder
              name={product.name}
              ratio="4/3"
              seed={seedFrom(product.slug)}
              className="border-0"
            />
          )}
        </div>

        {/* Resumen */}
        <div className="flex flex-col gap-4">
          <Tag accent="guayaba">{product.categoryName}</Tag>
          <h1 className="font-serif text-4xl text-cacao sm:text-5xl">
            {product.name}
          </h1>
          <PriceSeal amount={product.price} compareAt={product.compareAt} size="lg" />
          <StatusBadge
            label={product.available ? "Disponible por encargo" : "No disponible"}
            tone={product.available ? "pistacho" : "apagado"}
          />
          {product.shortDescription ? (
            <p className="text-tinta-suave">{product.shortDescription}</p>
          ) : null}

          {product.available ? (
            <ButtonLink
              href={`/encargo?producto=${product.slug}`}
              size="lg"
              fullWidth
              className="mt-2"
            >
              Hacer encargo
            </ButtonLink>
          ) : (
            <p className="rounded-(--radius-soft) border border-linea bg-papel px-4 py-3 text-sm text-tinta-suave">
              Por ahora no lo tenemos disponible. Escríbenos y te avisamos
              cuando vuelva.
            </p>
          )}

          {useProvisionalData ? (
            <p className="font-sans text-xs text-tinta-suave">
              Ficha con datos de desarrollo (precio, foto e ingredientes
              provisionales).
            </p>
          ) : null}
        </div>
      </div>

      {/* Detalle de receta */}
      <div className="mt-12 max-w-2xl">
        <RecipeDetail
          recipe={{
            description: product.description,
            ingredients: product.ingredients,
            allergens: product.allergens ?? undefined,
            prepDays: product.prepDays,
          }}
        />
      </div>

      <div className="mt-10">
        <Link
          href={`/tienda/${product.categorySlug}`}
          className="font-sans text-sm text-guayaba-tinta underline decoration-kraft underline-offset-4 hover:text-cacao"
        >
          ← Ver más de {product.categoryName}
        </Link>
      </div>
    </>
  );
}

export default function ProductoPage({ params }: { params: ProductoParams }) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
      <Suspense fallback={<ProductoFallback />}>
        <ProductoDetalle params={params} />
      </Suspense>
    </main>
  );
}
