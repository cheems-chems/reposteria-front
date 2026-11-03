import type { BuilderItemProduct, ComboProduct } from "@/lib/api";

type ComboGallerySource = Pick<ComboProduct, "imageUrl" | "images" | "composition">;
type IngredientGallerySource = Pick<BuilderItemProduct, "slug" | "imageUrl" | "images">;

function firstPhoto(
  product: Pick<BuilderItemProduct, "imageUrl" | "images">,
): string | null {
  return product.images?.find((image) => image.trim().length > 0) ?? product.imageUrl ?? null;
}

function uniquePhotos(images?: string[]): string[] {
  const photos = new Set<string>();
  for (const image of images ?? []) {
    if (image.trim().length > 0) photos.add(image);
  }
  return [...photos];
}

/** Devuelve la imagen propia del combo seguida de las fotos de su composición. */
export function comboGalleryImages(
  combo: ComboGallerySource,
  ingredients: IngredientGallerySource[],
): string[] {
  const ownPhotos = uniquePhotos(combo.images);
  if (ownPhotos.length > 0) return ownPhotos;

  const ingredientBySlug = new Map(
    ingredients.map((ingredient) => [ingredient.slug, firstPhoto(ingredient)]),
  );
  const uniqueImages = new Set<string>();

  for (const image of [
    firstPhoto(combo),
    ...combo.composition.map(({ productSlug }) => ingredientBySlug.get(productSlug)),
  ]) {
    if (typeof image === "string" && image.length > 0) uniqueImages.add(image);
  }

  return [...uniqueImages];
}
