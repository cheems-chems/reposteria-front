import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeDetail } from "@/components/product/recipe-detail";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { PriceSeal } from "@/components/ui/price-seal";
import { ButtonLink } from "@/components/ui/button-link";
import { SafeImage } from "@/components/ui/safe-image";
import { Skeleton } from "@/components/states/skeleton";
import { orderLineForProduct } from "@/lib/encargo";
import { useProvisionalData } from "@/lib/api";
import {
  getComboItems,
  getProductBySlug,
  getProducts,
  type Product,
} from "@/lib/api";

type ProductoParams = Promise<{ slug: string }>;

/** Precio a mostrar: unitario en ítems de armador, fijo en el resto. */
function priceAmount(product: Product): number {
  return product.saleMode === "builder" ? product.unitPrice : product.price;
}

function fichaTypeLabel(product: Product): string | null {
  switch (product.saleMode) {
    case "combo":
      return `Combo · ${product.totalUnits} unidades`;
    case "pack":
      return `Bandeja · ${product.unitsPerPack} unidades`;
    case "builder":
      return "Se elige por unidades en el armador";
    default:
      return null;
  }
}

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

  const comboItems =
    product.saleMode === "combo" ? await getComboItems() : [];
  const composition =
    product.saleMode === "combo"
      ? product.composition.map((item) => ({
          name:
            comboItems.find((c) => c.slug === item.productSlug)?.name ??
            item.productSlug,
          quantity: item.quantity,
        }))
      : undefined;

  const typeLabel = fichaTypeLabel(product);
  const cta =
    product.saleMode === "builder"
      ? { href: `/encargo?categoria=${product.categorySlug}`, label: "Armar mi combo" }
      : { href: `/encargo?producto=${product.slug}`, label: "Hacer encargo" };
  const cartLine = product.available
    ? orderLineForProduct(product, comboItems)
    : null;

  return (
    <>
      <nav aria-label="Ruta" className="mb-6 flex flex-wrap gap-2 text-sm text-texto-suave">
        <Link className="hover:text-vino" href="/tienda">
          Tienda
        </Link>
        <span aria-hidden="true">/</span>
        <Link className="hover:text-vino" href={`/tienda/${product.categorySlug}`}>
          {product.categoryName}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="relative overflow-hidden border border-borde bg-lienzo">
          {product.imageUrl ? (
            <div className="relative aspect-4/3">
              <SafeImage
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                fallback={
                  <PhotoPlaceholder
                    name={product.name}
                    ratio="4/3"
                    seed={seedFrom(product.slug)}
                    className="border-0"
                  />
                }
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

        <div className="flex flex-col gap-4">
          <Tag accent="guayaba">{product.categoryName}</Tag>
          <h1 className="font-serif text-4xl text-vino sm:text-5xl">
            {product.name}
          </h1>
          <PriceSeal amount={priceAmount(product)} compareAt={product.compareAt} size="lg" />
          {typeLabel ? (
            <p className="font-sans text-sm font-medium text-fucsia-hover">
              {typeLabel}
            </p>
          ) : null}
          <p className="font-sans text-xs text-texto-suave">
            El valor final lo confirmamos por WhatsApp.
          </p>
          <StatusBadge
            label={product.available ? "Disponible por encargo" : "No disponible"}
            tone={product.available ? "pistacho" : "apagado"}
          />
          {product.preparations && product.preparations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.preparations.map((preparation) => (
                <Tag key={preparation.id} accent="pistacho">
                  {preparation.label}
                </Tag>
              ))}
            </div>
          ) : null}
          {product.shortDescription ? (
            <p className="text-texto-suave">{product.shortDescription}</p>
          ) : null}

          {product.available ? (
            <div className="mt-2 flex flex-col gap-2">
              <ButtonLink href={cta.href} size="lg" fullWidth>
                {cta.label}
              </ButtonLink>
              {cartLine ? (
                <AddToCartButton
                  line={cartLine}
                  size="lg"
                  variant="secondary"
                  fullWidth
                />
              ) : null}
            </div>
          ) : (
            <p className="rounded-soft border border-borde bg-tarjeta px-4 py-3 text-sm text-texto-suave">
              Por ahora no lo tenemos disponible. Escríbenos y te avisamos
              cuando vuelva.
            </p>
          )}

          {useProvisionalData ? (
            <p className="font-sans text-xs text-texto-suave">
              Ficha con datos de desarrollo (precio, foto y datos
              provisionales).
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <RecipeDetail
          recipe={{
            description: product.description,
            ingredients: product.ingredients,
            allergens: product.allergens ?? undefined,
            prepDays: product.prepDays,
            composition,
          }}
        />
      </div>

      <div className="mt-10">
        <Link
          href={`/tienda/${product.categorySlug}`}
          className="font-sans text-sm text-fucsia-hover underline decoration-rosa-medio underline-offset-4 hover:text-vino"
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
