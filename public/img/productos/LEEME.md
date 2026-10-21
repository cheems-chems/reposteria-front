# Fotos de productos

Las fotos optimizadas van en una carpeta por producto, usando su slug dentro
de la sección correspondiente. Por ejemplo:

- `dulces/cookies/`
- `dulces/tortas-personalizadas/`

Pon primero la foto principal y nombra los originales en orden alfabético para
que el optimizador genere `01.webp`, `02.webp` y siguientes. Guarda los
originales en la misma ruta relativa bajo `fotos-originales/` y ejecuta
`npm run fotos`.

Las galerías compartidas se mantienen en `salados/combos/` y `congelados/`.
Se muestran en las fichas que correspondan, pero las tarjetas de esos
productos conservan el arte de su sección.

Deja las carpetas vacías que ya no se usen con su `.gitkeep`; no las borres.
