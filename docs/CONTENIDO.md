# Contenido e imágenes

Guía para reemplazar los marcadores de posición por material real del negocio.
Todo el contenido editable vive en pocos archivos; no hace falta tocar las
páginas.

## Foto del héroe (portada)

La portada usa `public/img/hero/hero-rosa.png`.

Para cambiarla, guarda la foto en `public/img/hero/` y actualiza `HERO_IMAGE`
en `src/app/(sitio)/page.tsx` con su ruta pública. La portada la muestra con
`next/image`, proporción 3:2 y carga prioritaria (`preload`).

Recomendaciones para que se vea bien:

- **Foto rectangular** con fondo claro: el encuadre la muestra entera
  (`object-contain`) sobre el lienzo rosa. Usa una foto de al menos 1200 px de
  ancho.
- **Recorte con transparencia** (PNG/WebP sin fondo): se ve como si el producto
  "saliera" de la tarjeta; se apoya en la base y puede solaparse un poco con el
  borde. Exporta a ~1200×800 px.
- Proporción ideal 3:2 (por ejemplo 1200×800). El espacio es estable, así que
  cambiar la foto no mueve la página.
- Usa SIEMPRE fotos propias del negocio. Nunca fotos de stock presentadas como
  propias.

> El texto `alt` es lo que leen los lectores de pantalla: descríbelo como si
> contaras la foto a alguien por teléfono.

## Círculos de sección ("Compra por sección")

Los tres círculos (Dulces, Salados, Congelados) salen de los datos. Cuando el
panel tenga fotos, cada sección traerá su `imageUrl`. Mientras tanto muestran un
marcador rosa.

- Datos de desarrollo: `src/lib/api/dev-data.ts` (`DEV_SECTIONS`), campo
  `imageUrl`.
- Contrato del backend: ver `docs/ENDPOINTS-NECESARIOS.md` → `GET /sections`.

## Fotos de producto

Cada producto reserva un espacio para su foto (fichas de la tienda, "Los más
pedidos" de la portada, combo destacado y ficha `/producto/[slug]`). Mientras no
haya archivo se muestra un marcador rosa honesto de **"foto pendiente"** (nunca
stock).

- Las fotos optimizadas están en `public/img/productos/<categoría>/`, con la
  misma ruta de categoría que `fotos-originales/`. Las fotos de cookies y tortas
  personalizadas usan nombres numerados (`01.webp`, `02.webp`, etc.).
- La URL la entrega el backend en el campo `imageUrl` del producto (ver
  `docs/ENDPOINTS-NECESARIOS.md` → `GET /products`). En datos provisionales, las
  rutas están en `src/lib/api/tienda/*.ts`.
- Proporciones de diseño: las fichas de la tienda usan **4:5** y el combo
  destacado de la portada usa **4:3**. Exporta al menos 800 px de ancho y usa
  `object-cover` (la foto se recorta para llenar el marco).

## Banner de combos

El banner "Arma tu combo" usa `src/lib/brand.ts` → `banner.combos`. `null` = sin
imagen. Si se agrega una imagen, guárdala en `public/brand/` y asigna a
`banner.combos` su ruta pública, que empieza por `/brand/`.

```ts
banner: {
  combos: null,
},
```

## Logo

- Imagen única (header/footer): `public/brand/logo-elvis-512.png` (círculo con
  fondo transparente, 180×180).
- Favicon: `src/app/icon.png` (la misma imagen).
- Ajusta la ruta en `src/lib/brand.ts` (`logo` / `logoMaster`).

## Textos de marca

Nombre, eslogan y descripción viven en `src/lib/brand.ts`. Los datos de
contacto, dirección y horarios **no** se inventan: se dejan vacíos aquí y
llegarán desde el backend (`GET /store`).

## Paleta y tipografía

Los colores y las fuentes son tokens en `src/app/globals.css` (`@theme`). No
uses colores sueltos en los componentes: salen de ahí. La paleta se resume en
`/muestra`.
