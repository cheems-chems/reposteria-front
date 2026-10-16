// 'use cache' + cacheLife es necesario con Cache Components de Next 16.

import { cacheLife } from "next/cache";
import { apiBaseUrl } from "./config";
import { ApiError } from "./types";

interface FetchOptions {
  method?: "GET";
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
