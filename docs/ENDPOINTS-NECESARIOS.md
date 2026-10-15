# Endpoints necesarios (contrato pendiente)

Documento para el equipo de backend. El frontend consume estos endpoints a
través de la capa aislada `src/lib/api`. Mientras no existan, se usan datos de
desarrollo (ver más abajo).

## Cómo se activa el backend en el frontend

Variables de entorno (no versionadas):

| Variable | Valores | Efecto |
| --- | --- | --- |
| `NEXT_PUBLIC_USE_PROVISIONAL_DATA` | `"false"` | Desactiva los datos de desarrollo y usa la API real. Cualquier otro valor o ausente = datos de desarrollo ACTIVADOS. |
| `NEXT_PUBLIC_API_URL` | URL base, p. ej. `https://api.dominio.com` | Base del backend. Obligatoria si los datos de desarrollo están desactivados. |

Cuando el backend esté listo:

```
NEXT_PUBLIC_USE_PROVISIONAL_DATA=false
NEXT_PUBLIC_API_URL=https://api.dominio.com
```

Formato general: JSON, UTF-8. Precios SIEMPRE enteros en pesos colombianos
(COP), sin decimales. El frontend formatea con `src/lib/format.ts`.

---

## 1. Listar secciones

Las secciones son la agrupación superior de la tienda (p. ej. **Dulces**,
**Salados** y **Congelados**) y ordenan tanto las categorías como el filtro de
`/tienda`.

- **Método y ruta:** `GET /sections`
- **Respuesta:** `Section[]`

```json
[
  { "slug": "dulces", "name": "Dulces", "orden": 1 },
  { "slug": "salados", "name": "Salados", "orden": 2 },
  { "slug": "congelados", "name": "Congelados", "orden": 3 }
]
```

- `orden` es un entero; el frontend ordena por él.
- Secciones y categorías las administra el negocio (panel/admin). El frontend
  no inventa secciones: si un producto o categoría queda sin `sectionSlug`,
  simplemente no aparece bajo ningún filtro de sección.

## 2. Listar categorías

- **Método y ruta:** `GET /categories`
- **Respuesta:** `Category[]`

```json
[
  {
    "slug": "tortas",
    "name": "Tortas",
    "description": "Tortas por encargo…",
    "sectionSlug": "dulces"
  },
  {
    "slug": "combos",
    "name": "Combos",
    "description": "Combos de pasabocas o arma el tuyo…",
    "sectionSlug": "salados",
    "builderMinTotalUnits": 50
  }
]
```

- `description` puede ser `null`.
- `sectionSlug` apunta a una sección de `GET /sections`; `null` si la categoría
  no pertenece a ninguna.
- `builderMinTotalUnits`: mínimo total de unidades del armador **"arma el tuyo
  desde cero"** de esa categoría. Solo aplica a categorías con ítems de armador
  (`saleMode` "builder"); `null`/ausente si no tiene armador.

Las categorías esperadas son **Dulces** (Tortas, Bizcochos, Postres) →
`dulces`, **Combos** → `salados` y **Bandejas** → `congelados`. La dueña administra
secciones, categorías y productos desde el panel (no se fijan en el código).

## 3. Obtener una categoría

- **Método y ruta:** `GET /categories/{slug}`
- **Respuesta:** `Category` o `null` si no existe (el frontend muestra 404).

## 4. Listar productos

- **Método y ruta:** `GET /products`
- **Query opcional:** `?category={slug}` para filtrar por categoría.
- **Respuesta:** `ProductListItem[]`

```json
[
  {
    "slug": "milhojas-de-guayaba",
    "name": "Milhojas de guayaba",
    "categorySlug": "tortas",
    "categoryName": "Tortas",
    "price": 45000,
    "compareAt": null,
    "available": true,
    "featured": true,
    "imageUrl": null,
    "shortDescription": "Hojaldre fino, guayaba…"
  }
]
```

Notas:
- `imageUrl` es la URL absoluta de la foto real; `null` si el negocio aún no
  la ha subido (el frontend muestra un marcador honesto, nunca stock).
- `compareAt` se usa para mostrar el precio anterior tachado.
- `saleMode` describe cómo se vende (ver sección 6): `"single"`, `"combo"`,
  `"builder"` o `"pack"`. Cada tipo lleva solo sus campos.
- **Ítems de armador (`saleMode: "builder"`):** no se listan en la tienda. El
  backend puede excluirlos de `GET /products` o marcarlos; el frontend los
  obtiene aparte (`GET /products?saleMode=builder`) para armar combos.

## 5. Productos destacados (portada)

- **Método y ruta:** `GET /products?featured=true`
- **Respuesta:** `ProductListItem[]`

## 6. Obtener un producto (y los cuatro modos de venta)

- **Método y ruta:** `GET /products/{slug}`
- **Respuesta:** `Product` o `null` si no existe (el frontend muestra 404).

Cada producto declara **`saleMode`**. Es una unión discriminada: cada modo
lleva SOLO sus campos.

### a) `single` — precio fijo (tortas, bizcochos, postres)

```json
{
  "slug": "milhojas-de-guayaba",
  "name": "Milhojas de guayaba",
  "categorySlug": "tortas",
  "categoryName": "Tortas",
  "saleMode": "single",
  "price": 45000,
  "compareAt": null,
  "available": true,
  "featured": true,
  "imageUrl": null,
  "shortDescription": "Hojaldre fino…",
  "description": "Tres capas de hojaldre…",
  "ingredients": ["Hojaldre de mantequilla", "Guayaba…"],
  "allergens": ["Gluten", "Huevo", "Lácteos"],
  "prepDays": 3
}
```

### b) `combo` — combo predefinido de precio fijo

```json
{
  "slug": "combo-1",
  "name": "Combo 1",
  "categorySlug": "combos",
  "categoryName": "Combos",
  "saleMode": "combo",
  "price": 43000,
  "totalUnits": 60,
  "editable": true,
  "allowedItems": ["deditos", "empanadas", "ojitos", "bolitas-de-carne"],
  "stepQty": 5,
  "composition": [
    { "productSlug": "deditos", "quantity": 15 },
    { "productSlug": "empanadas", "quantity": 15 },
    { "productSlug": "ojitos", "quantity": 15 },
    { "productSlug": "bolitas-de-carne", "quantity": 15 }
  ],
  "ingredients": [],
  "allergens": null,
  "prepDays": null
}
```

- `price`: **precio total fijo** del combo.
- `totalUnits`: unidades incluidas.
- `composition`: array de `{ productSlug, quantity }` donde `productSlug` apunta
  a un producto `saleMode: "builder"`. La suma debe ser igual a `totalUnits`.
- `editable`: si `true`, el cliente redistribuye cantidades entre `allowedItems`
  manteniendo `totalUnits`. **Regla de precio:** mientras el total de unidades
  sea igual, el precio NO cambia (sigue siendo `price`). El cliente no puede
  continuar si no coincide.
- `allowedItems`: slugs de ítems de armador que se pueden repartir. Ausente o
  vacío = por defecto los de `composition`.
- `stepQty`: incremento por ítem (por defecto 5); mínimo 0.

### c) `builder` — ítem de armador ("arma el tuyo desde cero")

Estos productos no se venden por separado ni se listan en la tienda: son los
pasabocas que se eligen por unidad dentro de un combo editable o del armador.

```json
{
  "slug": "deditos",
  "name": "Deditos",
  "categorySlug": "combos",
  "categoryName": "Combos",
  "saleMode": "builder",
  "comboItem": true,
  "unitPrice": 1000,
  "stepQty": 5,
  "ingredients": [],
  "allergens": null,
  "prepDays": null
}
```

- `comboItem: true` marca que es un ítem de armador.
- `unitPrice`: precio estimado por unidad (el catálogo real no lo trae; hoy va
  provisional).
- `stepQty`: incremento por producto (por defecto 5).
- El mínimo **total** de unidades del armador se configura en la categoría
  (`builderMinTotalUnits`, ver sección 2). El total del armador es
  `Σ unitPrice × cantidad`, siempre rotulado como precio estimado.

### d) `pack` — bandeja congelada

```json
{
  "slug": "bandeja-deditos-de-queso",
  "name": "Bandeja de deditos de queso",
  "categorySlug": "bandejas",
  "categoryName": "Bandejas",
  "saleMode": "pack",
  "price": 25000,
  "unitsPerPack": 10,
  "minPacks": 1,
  "stepPacks": 1,
  "shortDescription": "10 unidades congeladas, crudas para freír en casa.",
  "ingredients": [],
  "allergens": null,
  "prepDays": null
}
```

- `price`: precio **por bandeja**.
- `unitsPerPack`: unidades por bandeja (p. ej. 10).
- `minPacks` / `stepPacks`: mínimo y paso de bandejas (por defecto 1 y 1). El
  cliente elige el número de bandejas; el subtotal es `price × númeroDeBandejas`
  y las unidades son `unitsPerPack × númeroDeBandejas`. En un mismo encargo se
  pueden elegir varias bandejas distintas.

Notas críticas de honestidad de datos:
- `ingredients`: array; `[]` si el negocio no los declara.
- `allergens`: `null` = **no declarados** (no significa "sin alérgenos");
  `[]` = declarados como "sin alérgenos"; array = lista declarada.
- `prepDays`: días de anticipación; `null` si no aplica.
- Todos los precios del front son **estimados**; la repostería confirma el
  valor final por WhatsApp.
- Secciones, categorías, `saleMode`, `composition`, `allowedItems`, `editable`,
  `comboItem`, `unitPrice` y los `pack` los administra la dueña desde el panel.

## 7. Datos del negocio (Configuración)

- **Método y ruta:** `GET /store`
- **Respuesta:** `StoreInfo`

```json
{
  "name": "Elvi's",
  "tagline": "Hecho en casa",
  "description": "El sabor que une, lo hacemos con amor. Hechos en casa, pensados para compartir.",
  "city": null,
  "address": null,
  "whatsapp": null,
  "phone": null,
  "email": null,
  "instagram": null,
  "tiktok": null,
  "hours": []
}
```

- Los campos de contacto van vacíos o `null` hasta que el negocio los
  confirme. El frontend no muestra valores inventados.

## 8. Enviar contacto / crear encargo (pendiente)

- **Método y ruta:** `POST /contact` (o `POST /orders` según el contrato final)
- **Estado:** el formulario de `/contacto` es una **demo local** (valida y
  muestra resultado, no envía nada). Cuando exista este endpoint, se cablea en
  `src/components/store/contact-form.tsx`.
- **Cuerpo propuesto:**

```json
{
  "name": "string",
  "contact": "string (correo o WhatsApp)",
  "productType": "torta | bizcocho | postre | otro",
  "message": "string"
}
```

## 9. Modos de venta, preparaciones y datos administrables (pendiente)

El frontend ya usa estos campos en la capa `src/lib/api` (tipos y datos
provisionales); el backend aún no los provee. Ver la sección 6 para el
contrato exacto de cada modo.

**Modelo de venta dirigido por datos.** Cada producto declara `saleMode`
(`single` | `combo` | `builder` | `pack`) y el encargo decide la UI por ese
campo, no por categorías fijas en el código:

- `single`: precio fijo (tortas, bizcochos, postres).
- `combo`: combo predefinido con `price` fijo, `totalUnits`, `composition`
  (`{productSlug, quantity}`, suma = `totalUnits`) y, si `editable: true`,
  `allowedItems` para redistribuir. **Regla de precio editable:** el precio
  no cambia mientras el total sea `totalUnits`; si no coincide, no se permite
  continuar.
- `builder`: ítem de armador (pasaboca por unidad) con `comboItem: true`,
  `unitPrice` y `stepQty`. No se lista en la tienda. El mínimo total de
  unidades del armador vive en la categoría (`builderMinTotalUnits`).
- `pack`: bandeja congelada con `price` (por bandeja), `unitsPerPack`,
  `minPacks`, `stepPacks`; el cliente elige cuántas bandejas y de cuáles.

**Secciones y categorías.** Secciones `dulces`, `salados`, `congelados`;
categorías Tortas/Bizcochos/Postres → dulces, Combos → salados (con
`builderMinTotalUnits`), Bandejas → congelados. Secciones, categorías,
`saleMode` y los campos de cada modo los administra la dueña desde el panel.

**Preparaciones (soporte conservado, sin datos por ahora).** El frontend
contempla `preparations[]` (`id`, `label`, `priceDelta`, `description`) y las
calcula en `unitPrice`, pero **hoy ningún producto las usa** (las bandejas son
congeladas y se freír en casa, por eso no hay selector crudo/frito). Si el
negocio vuelve a ofrecerlas, el contrato de cálculo sigue siendo:

- **Cálculo de precio autoritativo** en servidor:
  `unitPrice = price + priceDelta(preparación)` (o `unitPrice + priceDelta` en
  ítems de armador); `lineTotal = unitPrice × quantity`; `total = Σ lineTotal`;
  `units = Σ quantity` (en `pack`: `Σ packCount × unitsPerPack`). El front solo
  estima y rotula "precio estimado".
- **Un encargo es por categoría por ahora** (`items[]` todos de una misma
  categoría). Si más adelante se permite mezclar categorías en un solo
  encargo, el modelo `items[]` lo soporta con cambios mínimos.
- `POST /orders` (o `/encargos`): cuerpo con `items[]` (unión discriminada por
  `kind`: `single`/`combo`/`builder`/`pack`, cada uno con sus campos),
  `date`, `people`, `details`, `fulfillment`, `address`, `name`, y total
  **recalculado** en servidor (nunca confiar en el total del cliente).
- Sin decimales: precios enteros COP. Los precios del front son siempre
  estimados; la dueña confirma por WhatsApp.

---

## Notas de implementación

- El frontend usa **Cache Components** de Next 16. El cliente HTTP
  (`src/lib/api/client.ts`) aplica `'use cache'` + `cacheLife('minutes')` a las
  respuestas. Ajustar el perfil de caché según la frecuencia real de cambio.
- Códigos de error: el cliente espera `2xx` con JSON. Otro código se convierte
  en `ApiError` (ver `src/lib/api/types.ts`). Definir el cuerpo de error estándar.
- CORS: si el frontend y la API viven en dominios distintos, habilitar CORS
  para el origen del sitio.
- Los nombres de campos de este documento son el contrato propuesto; si el
  backend usa otros, el único lugar a ajustar es `src/lib/api` (DTOs y
  funciones), no las páginas.
