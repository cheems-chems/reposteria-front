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

## 1. Listar categorías

- **Método y ruta:** `GET /categories`
- **Respuesta:** `Category[]`

```json
[
  { "slug": "tortas", "name": "Tortas", "description": "Tortas por encargo…" }
]
```

- `description` puede ser `null`.

## 2. Obtener una categoría

- **Método y ruta:** `GET /categories/{slug}`
- **Respuesta:** `Category` o `null` si no existe (el frontend muestra 404).

## 3. Listar productos

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

## 4. Productos destacados (portada)

- **Método y ruta:** `GET /products?featured=true`
- **Respuesta:** `ProductListItem[]`

## 5. Obtener un producto

- **Método y ruta:** `GET /products/{slug}`
- **Respuesta:** `Product` o `null` si no existe (el frontend muestra 404).

```json
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
  "shortDescription": "Hojaldre fino…",
  "description": "Tres capas de hojaldre…",
  "ingredients": ["Hojaldre de mantequilla", "Guayaba…"],
  "allergens": ["Gluten", "Huevo", "Lácteos"],
  "prepDays": 3
}
```

Notas críticas de honestidad de datos:
- `ingredients`: array; `[]` si el negocio no los declara.
- `allergens`: `null` = **no declarados** (no significa "sin alérgenos");
  `[]` = declarados como "sin alérgenos"; array = lista declarada.
- `prepDays`: días de anticipación; `null` si no aplica.

## 6. Datos del negocio (Configuración)

- **Método y ruta:** `GET /store`
- **Respuesta:** `StoreInfo`

```json
{
  "name": "Migaja",
  "tagline": "obrador de repostería por encargo",
  "description": "Horneamos por encargo…",
  "city": "Santa Marta",
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

## 7. Enviar contacto / crear encargo (pendiente)

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
