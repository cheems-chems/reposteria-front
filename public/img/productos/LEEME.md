# Fotos de productos

Las fotos optimizadas van en una carpeta propia por producto, con su slug
dentro de la sección correspondiente. Hoy tienen fotos propias:

- `dulces/cookies/`
- `dulces/tortas-personalizadas/`

Nombra las fotos originales en el orden deseado y guárdalas bajo la misma ruta
relativa en `fotos-originales/`. Ejecuta `npm run fotos` para generar las
salidas `01.webp`, `02.webp` y siguientes.

`salados/combos/` y `congelados/` son galerías compartidas para las fichas de
producto. No se usan para elegir automáticamente la foto de una tarjeta; una
foto explícita en los datos del producto sí puede aparecer en su tarjeta.

Conserva las carpetas vacías que ya no se usan con su `.gitkeep`.
