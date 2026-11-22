# Fotos de productos

Este es el único álbum de fotos de productos. Los archivos que usa la página
son WebP y están organizados por categoría y subcategoría. No se mantiene una
segunda carpeta de originales.

Las galerías organizadas hoy son:

- `dulces/cookies/`
- `dulces/tortas-personalizadas/`

Usa nombres descriptivos en minúsculas, sin espacios ni tildes. Para añadir una
foto, coloca temporalmente su archivo fuente en la carpeta de categoría
correspondiente, junto a los WebP, y revisa qué generaría el optimizador con:

```bash
node scripts/optimizar-fotos.mjs --dry-run --folder dulces/cookies
```

Para generar el WebP, ejecuta `npm run fotos -- --folder dulces/cookies`.
El optimizador nunca sobrescribe un WebP existente. Revisa el resultado y luego
quita el archivo fuente temporal para conservar un solo archivo por foto.

`salados/combos/` y `congelados/` contienen imágenes compartidas o asignadas
explícitamente desde los datos de productos. Las imágenes de combos también se
usan en sus galerías.

El optimizador recorre las imágenes fuente temporales dentro de
`public/img/productos/` y escribe el WebP en la misma carpeta. Las rutas de los
datos y las galerías deben coincidir exactamente, respetando mayúsculas y
minúsculas.

## Imágenes optimizadas sin original disponible

Estas imágenes se usan en el sitio; no hay un archivo fuente disponible:

- `congelados/empanaditas-congeladas.webp` — sin original disponible.
- `congelados/ojitos.webp` — sin original disponible.
- `salados/combos/combos-surtidos.webp` — sin original disponible.
