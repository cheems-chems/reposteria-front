// NEXT_PUBLIC_USE_PROVISIONAL_DATA: solo "false" apaga los datos de desarrollo (cualquier otro valor o su ausencia los mantiene activados); NEXT_PUBLIC_API_URL obligatoria cuando están desactivados.

export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

export const useProvisionalData =
  process.env.NEXT_PUBLIC_USE_PROVISIONAL_DATA !== "false";
