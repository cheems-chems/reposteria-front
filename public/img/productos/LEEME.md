# Fotos de productos

Las fotos optimizadas están en `public/img/productos/`, organizadas por
categoría y subcategoría. Los originales se guardan en la ruta equivalente bajo
`fotos-originales/`. Hoy hay galerías de dulces en:

- `dulces/cookies/`
- `dulces/tortas-personalizadas/`

Nombra las fotos originales en el orden deseado y guárdalas bajo la misma ruta
relativa en `fotos-originales/`. Ejecuta `npm run fotos` para generar las
salidas `01.webp`, `02.webp` y siguientes.

`salados/combos/` y `congelados/` contienen imágenes compartidas o asignadas
explícitamente desde los datos de productos. Las imágenes de combos también se
usan en sus galerías.

El optimizador recorre `fotos-originales/` y genera WebP numerados en la carpeta
equivalente bajo `public/img/productos/`. No renombres manualmente las salidas
que estén referenciadas por los datos sin actualizar esas rutas.
