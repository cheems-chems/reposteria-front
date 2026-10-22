import { alturas, maxPisos, moldes } from "@/content/torta-personalizada";

export type Piso = { molde: string };
export type DatosPedido = {
  nombre: string;
  correo?: string;
  fecha: string;
  entrega: "recoger" | "domicilio";
  direccion?: string;
  notas?: string;
};
export type CampoDatosPedido = keyof DatosPedido;
export type ErroresDatosPedido = Partial<Record<CampoDatosPedido, string>>;

const moldesPorId = new Map<string, (typeof moldes)[number]>(moldes.map((molde) => [molde.id, molde]));

const fechaISO = /^\d{4}-\d{2}-\d{2}$/;

function fechaDesdeISO(valor: string): Date | null {
  if (!fechaISO.test(valor)) return null;
  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }
  return fecha;
}

function hoyLocal(): Date {
  const ahora = new Date();
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
}

export function fechaHoyISO(): string {
  const hoy = hoyLocal();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function formatearFechaLegible(fecha: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(fecha)
    .replace(/,/g, "");
}

export function validarDatosPedido(datos: DatosPedido): ErroresDatosPedido {
  const errores: ErroresDatosPedido = {};

  if (!datos.nombre.trim()) {
    errores.nombre = "Escribe tu nombre.";
  }

  if (!datos.fecha.trim()) {
    errores.fecha = "Elige la fecha en que la necesitas.";
  } else {
    const fecha = fechaDesdeISO(datos.fecha);
    if (!fecha) {
      errores.fecha = "Escribe una fecha válida.";
    } else if (fecha < hoyLocal()) {
      errores.fecha = "Elige una fecha de hoy en adelante.";
    }
  }

  if (datos.entrega !== "recoger" && datos.entrega !== "domicilio") {
    errores.entrega = "Elige cómo quieres recibirla.";
  } else if (datos.entrega === "domicilio" && !datos.direccion?.trim()) {
    errores.direccion = "Escribe la dirección de entrega.";
  }

  const correo = datos.correo?.trim();
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.correo = "Escribe un correo válido.";
  }

  return errores;
}

export function normalizarPisos(pisos: Piso[]): Piso[] {
  const result: Piso[] = [];
  for (const piso of pisos.slice(0, maxPisos)) {
    const molde = moldesPorId.get(piso.molde);
    if (!molde) continue;
    const ordenInferior = result.length ? moldesPorId.get(result[result.length - 1].molde)!.orden : Infinity;
    const permitido = molde.orden <= ordenInferior ? molde : moldes.find((item) => item.orden === ordenInferior)!;
    result.push({ molde: permitido.id });
  }
  return result;
}

export function precioMinimoTorta(): number { return moldes[0].price; }
export function moldesPermitidos(moldeDeAbajo?: string) {
  if (!moldeDeAbajo) return [...moldes];
  const base = moldesPorId.get(moldeDeAbajo);
  return base ? moldes.filter((molde) => molde.orden <= base.orden) : [];
}
// CONFIRMAR con Elvi: si los pisos llevan recargo, cambiar aquí.
export function calcularEstimado(pisos: Piso[]): number {
  return normalizarPisos(pisos).reduce((total, piso) => total + (moldesPorId.get(piso.molde)?.price ?? 0), 0);
}
export function esTortaValida(pisos: Piso[]): boolean {
  const normalizados = normalizarPisos(pisos);
  return pisos.length > 0 && normalizados.length === pisos.length && normalizados.every((piso, i) => piso.molde === pisos[i].molde);
}
export function armarMensajeWhatsApp(
  pisos: Piso[],
  estimado: number,
  datos?: DatosPedido,
): string {
  const normalizados = normalizarPisos(pisos);
  const lista = normalizados.map((piso, i) => `Piso ${i + 1}${i === 0 ? " (abajo)" : i === normalizados.length - 1 ? " (arriba)" : ""}: ${moldesPorId.get(piso.molde)?.label}`).join("\n");
  const formato = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(estimado);
  const lineas: string[] = [];
  const nombre = datos?.nombre.trim();

  lineas.push(
    nombre
      ? `Hola Elvi, soy ${nombre} y quiero cotizar una torta personalizada:`
      : "Hola Elvi, quiero cotizar una torta personalizada:",
  );
  lineas.push(lista);
  lineas.push(`Estimado: desde $${formato}.`);

  if (datos) {
    const fecha = fechaDesdeISO(datos.fecha);
    if (fecha) {
      lineas.push(`La necesito para el ${formatearFechaLegible(fecha)}.`);
    }

    if (datos.entrega === "recoger") {
      lineas.push("La recojo en casa.");
    } else if (datos.entrega === "domicilio" && datos.direccion?.trim()) {
      lineas.push(`La necesito a domicilio: ${datos.direccion.trim()}.`);
    }

    if (datos.correo?.trim()) {
      lineas.push(`Si quieres escribirme, mi correo es ${datos.correo.trim()}.`);
    }

    if (datos.notas?.trim()) {
      lineas.push(`Quiero contarte algo más: ${datos.notas.trim()}`);
    }
  }

  lineas.push("¿Me ayudas a definir el diseño, los colores y la decoración?");

  return lineas.join("\n");
}
export function geometriaPisos(pisos: Piso[], anchoMax: number, alto: number) {
  return normalizarPisos(pisos).map((piso) => {
    const molde = moldesPorId.get(piso.molde)!;
    return {
      molde: molde.id,
      label: molde.label,
      ancho: anchoMax * molde.diametroRelativo,
      alto,
    };
  });
}

export { alturas, moldes, maxPisos };
