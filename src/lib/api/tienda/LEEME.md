# LEEME — datos provisionales de la tienda

Los productos viven en un archivo por sección:

- `dulces.ts` — sección Dulces (Tortas, Bizcochos, Postres)
- `salados.ts` — sección Salados (Combos y los ingredientes del armador)
- `congelados.ts` — sección Congelados (Bandejas)
- `index.ts` — junta todo; no editar productos aquí

Los tipos están en `../types.ts` (no duplicar).

## Agregar un producto

Abre el archivo de su sección, copia un producto existente como referencia,
pégalo en la lista (`*_PRODUCTS`) y rellena los campos. El `slug` debe ser
único en todo el catálogo.

## Cambiar un precio

Busca el producto en su archivo y cambia `price` (o `unitPrice` en los
ingredientes del armador). Solo enteros en pesos (COP).

## Desactivar un producto

Cambia `available: true` a `available: false`. No se borra nada; el producto
deja de venderse hasta que lo actives de nuevo.

## Agregar una sección nueva

1. Crea un archivo nuevo, por ejemplo `nueva.ts`, copiando la estructura de
   `congelados.ts` (sección + categorías + productos).
2. En `index.ts`: importa sus listas y agrégalas a `SECTIONS`, `CATEGORIES`
   y `PRODUCTS`.

## Fotos de productos

Sin foto se ve el dibujo SVG de su sección sobre fondo de color. Para poner
foto real:

1. Coloca temporalmente la foto fuente en
   `public/img/productos/<categoría>/<subcategoría>/`, junto a las imágenes del
   álbum.
2. Usa un nombre descriptivo en minúsculas y sin espacios y genera el WebP
   correspondiente con `npm run fotos -- --folder <ruta-relativa>`.
3. Revisa el WebP y quita el archivo fuente temporal para dejar un solo archivo
   por foto.
4. En el producto, pon `imageUrl` con la ruta pública del WebP correspondiente,
   por ejemplo
   `/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-01.webp`.
   Para una galería, `imageUrl` también acepta una lista de rutas, por ejemplo
   `imageUrl: ["/img/productos/categoria/foto-01.webp", "/img/productos/categoria/foto-02.webp"]`;
   la primera se usa como principal y las demás aparecen en la ficha.

Para revisar qué generaría una carpeta sin escribir archivos usa
`node scripts/optimizar-fotos.mjs --dry-run --folder <ruta-relativa>`. El álbum
único de productos es `public/img/productos/`.

Si `imageUrl` no está definido o la ruta falla, se sigue viendo el dibujo;
una foto rota no rompe la página. La foto de la sección funciona igual
(`imageUrl` en la sección, archivo bajo `public/` y ruta pública coincidente).

## Validación

Al cargar, `index.ts` valida el catálogo completo (slugs de secciones,
categorías y productos sin repetir; cada producto apunta a una categoría
existente y cada categoría a una sección existente). Si algo falla, la app
detiene con un mensaje `Catálogo incoherente: ...`.

Todo sigue provisional: se usa solo cuando `NEXT_PUBLIC_USE_PROVISIONAL_DATA`
no es `"false"`. Los precios son ficticios salvo los 4 combos reales.
