/** El año se calcula al cargar el módulo (estable para el prerender de Next). */
const YEAR = new Date().getFullYear();

export function CopyrightYear() {
  return <>{YEAR}</>;
}
