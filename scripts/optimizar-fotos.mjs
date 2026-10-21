import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const inputRoot = path.join(root, "fotos-originales");
const outputRoot = path.join(root, "public", "img", "productos");
const manifestPath = path.join(inputRoot, ".fotos-manifest.json");
const acceptedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile() && acceptedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolute);
    }
  }
  return files;
}

async function outputBytes(directory) {
  let total = 0;
  let count = 0;
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return { total, count };
    throw error;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await outputBytes(absolute);
      total += nested.total;
      count += nested.count;
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".webp") {
      total += (await fs.stat(absolute)).size;
      count += 1;
    }
  }
  return { total, count };
}

const manifest = await readManifest();
let inputs = [];
try {
  inputs = await walk(inputRoot);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No existe fotos-originales/; no hay fotos para optimizar.");
}

const folders = new Map();
for (const input of inputs) {
  const relative = path.relative(inputRoot, input);
  const relativeDirectory = path.dirname(relative);
  const folderKey = relativeDirectory === "." ? "" : relativeDirectory;
  if (!folders.has(folderKey)) folders.set(folderKey, []);
  folders.get(folderKey).push({ input, relative });
}

for (const [folder, images] of folders) {
  images.sort((a, b) => a.relative.localeCompare(b.relative, "en", { sensitivity: "base" }));
  const outputDirectory = path.join(outputRoot, folder);
  await fs.mkdir(outputDirectory, { recursive: true });
  for (const [index, image] of images.entries()) {
    const extension = path.extname(image.input).toLowerCase();
    const outputRelative = path.join(folder, `${String(index + 1).padStart(2, "0")}.webp`);
    const output = path.join(outputRoot, outputRelative);
    const digest = createHash("sha256").update(await fs.readFile(image.input)).digest("hex");
    if (manifest[outputRelative] === digest) continue;

    try {
      await sharp(image.input)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      manifest[outputRelative] = digest;
    } catch (error) {
      if (extension === ".heic") {
        console.warn(`No se pudo leer HEIC ${image.relative}; esta versión de sharp o el archivo no lo admite. Se continúa con las demás fotos.`);
      } else {
        console.warn(`No se pudo optimizar ${image.relative}: ${error.message}`);
      }
    }
  }
  const { total, count } = await outputBytes(outputDirectory);
  console.log(`${folder || "."}: ${count} fotos WebP, ${(total / 1024 / 1024).toFixed(2)} MB`);
}

await fs.mkdir(outputRoot, { recursive: true });
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

