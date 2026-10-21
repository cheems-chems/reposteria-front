import "server-only";

import { readdirSync } from "node:fs";
import path from "node:path";

export const GALERIA_POR_PRODUCTO: Readonly<Record<string, string>> = {
  cookies: "dulces/cookies",
  "tortas-personalizadas": "dulces/tortas-personalizadas",
  "combo-1": "salados/combos",
  "combo-2": "salados/combos",
  "combo-3": "salados/combos",
  "combo-4": "salados/combos",
  "bandeja-deditos-de-queso": "congelados",
  "bandeja-deditos-de-bocadillo": "congelados",
  "bandeja-mixta-queso-bocadillo": "congelados",
  "bandeja-deditos-de-bocaqueso": "congelados",
  "bandeja-empanaditas-de-pollo": "congelados",
  "bandeja-empanadas-de-pollo": "congelados",
  "bandeja-empanadas-de-carne": "congelados",
  "bandeja-empanadas-de-queso": "congelados",
  "bandeja-empanadas-de-jamon-con-queso": "congelados",
  "bandeja-empanadas-hawaianas": "congelados",
  "bandeja-bolitas-de-carne": "congelados",
  "bandeja-ojitos-de-salchicha": "congelados",
};

const SHARED_GALLERY_FOLDERS = new Set(["salados/combos", "congelados"]);

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const imageRoot = path.join(process.cwd(), "public", "img", "productos");

function listFolderImages(folder: string): string[] {
  try {
    const entries = readdirSync(path.join(imageRoot, folder), { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          imageExtensions.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }))
      .map((name) => `/img/productos/${folder}/${encodeURIComponent(name)}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export function getCardImage(
  slug: string,
  imageUrl?: string | null,
): string | null {
  const folder = GALERIA_POR_PRODUCTO[slug];
  if (imageUrl) return imageUrl;
  if (folder && SHARED_GALLERY_FOLDERS.has(folder)) return null;
  if (!folder) return null;
  return listFolderImages(folder)[0] ?? null;
}

export async function getProductImages(
  slug: string,
  imageUrl?: string | null,
): Promise<string[]> {
  const folder = GALERIA_POR_PRODUCTO[slug];
  if (!folder) return [];

  const images = listFolderImages(folder);
  return images.length > 0 ? images : imageUrl ? [imageUrl] : [];
}
