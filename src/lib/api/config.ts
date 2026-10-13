/*
  ============================================================================
  CONFIGURACIÓN DE LA CAPA DE DATOS
  ----------------------------------------------------------------------------
  Interruptor único para alternar entre datos de desarrollo y backend real.

  Variables de entorno:
    NEXT_PUBLIC_USE_PROVISIONAL_DATA  -> "false" desactiva los datos mock.
                                          Cualquier otro valor (o ausencia)
                                          los mantiene ACTIVADOS.
    NEXT_PUBLIC_API_URL               -> base del backend, p. ej.
                                          http://localhost:8000/api
                                          Obligatoria cuando los mocks están
                                          desactivados.

  Cuando el backend exista: define NEXT_PUBLIC_USE_PROVISIONAL_DATA=false y
  NEXT_PUBLIC_API_URL en el entorno. El resto de la app no cambia.
  ============================================================================
*/

/** Base del backend, sin barra final. Vacío si no se configuró. */
export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

/**
 * ACTIVADO por defecto: mientras no exista contrato de API, la app muestra
 * datos de desarrollo claramente marcados. Pon "false" para apagarlos.
 */
export const useProvisionalData =
  process.env.NEXT_PUBLIC_USE_PROVISIONAL_DATA !== "false";
