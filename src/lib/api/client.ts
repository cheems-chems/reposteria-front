/*
  ============================================================================
  CLIENTE HTTP DEL BACKEND (CAPA AISLADA)
  ----------------------------------------------------------------------------
  Único punto de contacto con la API real. Hoy no se usa porque los datos de
  desarrollo están activos (ver ./config.ts). Cuando el backend exista, esta
  función centraliza base URL, credenciales y manejo de errores.

  El `'use cache'` + `cacheLife` mantiene la respuesta cacheada (necesario con
  Cache Components de Next 16). Ajusta el perfil cuando exista el contrato.
  ============================================================================
*/

import { cacheLife } from "next/cache";
import { apiBaseUrl } from "./config";
import { ApiError } from "./types";

interface FetchOptions {
  /** Método HTTP. Solo GET por ahora (la tienda es de lectura). */
  method?: "GET";
  /** Señal de cancelación opcional. */
  signal?: AbortSignal;
}

async function fetchJson<T>(path: string, options: FetchOptions = {}): Promise<T> {
  "use cache";
  cacheLife("minutes");

  if (!apiBaseUrl) {
    throw new ApiError(
      "El backend no está configurado. Define NEXT_PUBLIC_API_URL o mantén " +
        "NEXT_PUBLIC_USE_PROVISIONAL_DATA activado para ver datos de desarrollo.",
      0,
      path,
    );
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: { Accept: "application/json" },
    signal: options.signal,
  });

  if (!res.ok) {
    throw new ApiError(
      `La consulta a ${path} falló con estado ${res.status}.`,
      res.status,
      path,
    );
  }

  return (await res.json()) as T;
}

export { fetchJson };
