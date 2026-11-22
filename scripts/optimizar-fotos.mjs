import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const productRoot = path.join(root, "public", "img", "productos");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png", ".heic"]);

function outputName(input) {
  const base = path
    .basename(input, path.extname(input))
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!base) throw new Error(`El nombre no produce una ruta válida: ${input}`);
  return `${base}.webp`;
}

function parseOptions(argv) {
  const options = { dryRun: false, folder: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") {
      options.dryRun = true;
    } else if (argv[i] === "--folder") {
      const value = argv[i + 1];
      if (!value) throw new Error("Falta la carpeta después de --folder.");
      options.folder = value.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
      if (options.folder.split("/").some((part) => part === ".." || part === ".")) {
        throw new Error("--folder debe ser una ruta relativa dentro de public/img/productos/.");
      }
      i += 1;
    } else {
      throw new Error(`Opción no reconocida: ${argv[i]}`);
    }
  }
  return options;
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolute);
    }
  }
  return files;
}

const options = parseOptions(process.argv.slice(2));
let inputs = [];
try {
  inputs = await walk(productRoot);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No existe public/img/productos/; no hay fotos para optimizar.");
}

const folders = new Map();
for (const input of inputs) {
  const relative = path.relative(productRoot, input);
  const folder = path.dirname(relative);
  const folderKey = folder === "." ? "" : folder.split(path.sep).join("/");
  if (!folders.has(folderKey)) folders.set(folderKey, []);
  folders.get(folderKey).push(input);
}

let processedFolders = 0;
for (const [folderKey, images] of folders) {
  if (options.folder && folderKey !== options.folder) continue;
  processedFolders += 1;
  const outputNames = new Set();
  for (const input of images) {
    const fileName = outputName(input);
    if (outputNames.has(fileName)) {
      throw new Error(`Hay nombres de origen duplicados en ${folderKey || "."}: ${fileName}`);
    }
    outputNames.add(fileName);
    const output = path.join(path.dirname(input), fileName);
    const outputExists = await fs.stat(output).then(() => true).catch((error) => {
      if (error.code === "ENOENT") return false;
      throw error;
    });
    const relativeOutput = [folderKey, fileName].filter(Boolean).join("/");
    if (outputExists) {
      console.log(`[ya existe, no se sobrescribe] ${relativeOutput}`);
      continue;
    }
    if (options.dryRun) {
      console.log(`[dry-run: generaría] ${relativeOutput}`);
      continue;
    }
    try {
      await sharp(input)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      console.log(`[generada] ${relativeOutput}`);
    } catch (error) {
      if (path.extname(input).toLowerCase() === ".heic") {
        console.warn(`No se pudo leer HEIC ${input}; esta versión de sharp o el archivo no lo admite.`);
      } else {
        throw error;
      }
    }
  }
}

if (options.folder && processedFolders === 0) {
  console.log(`No hay originales en public/img/productos/${options.folder}/.`);
}
if (options.dryRun) console.log("Dry run: no se escribieron archivos.");
