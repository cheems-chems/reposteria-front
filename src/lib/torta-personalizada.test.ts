import { describe, expect, it } from "vitest";

import {
  armarMensajeWhatsApp,
  validarDatosPedido,
  type DatosPedido,
} from "@/lib/torta-personalizada";

const base: DatosPedido = {
  nombre: "Ana",
  fecha: "2999-11-14",
  entrega: "recoger",
};

describe("validarDatosPedido", () => {
  it("pide el nombre", () => {
    const errores = validarDatosPedido({ ...base, nombre: "   " });
    expect(errores.nombre).toBe("Escribe tu nombre.");
  });

  it("rechaza una fecha pasada", () => {
    const errores = validarDatosPedido({ ...base, fecha: "2000-01-01" });
    expect(errores.fecha).toBe("Elige una fecha de hoy en adelante.");
  });

  it("rechaza una fecha con formato inválido", () => {
    const errores = validarDatosPedido({ ...base, fecha: "14/11/2999" });
    expect(errores.fecha).toBe("Escribe una fecha válida.");
  });

  it("pide la dirección cuando es a domicilio", () => {
    const errores = validarDatosPedido({ ...base, entrega: "domicilio" });
    expect(errores.direccion).toBe("Escribe la dirección de entrega.");
  });

  it("rechaza un correo inválido", () => {
    const errores = validarDatosPedido({ ...base, correo: "ana@" });
    expect(errores.correo).toBe("Escribe un correo válido.");
  });

  it("acepta todo correcto", () => {
    const errores = validarDatosPedido({
      ...base,
      correo: "ana@example.com",
      notas: "Es para un cumpleaños.",
    });
    expect(errores).toEqual({});
  });

  it("acepta recoger sin dirección", () => {
    const errores = validarDatosPedido({
      ...base,
      entrega: "recoger",
      direccion: "",
    });
    expect(errores).toEqual({});
  });
});

describe("armarMensajeWhatsApp", () => {
  const pisos = [{ molde: "una-libra" }];

  it("arma el mensaje sin datos", () => {
    const mensaje = armarMensajeWhatsApp(pisos, 95000);

    expect(mensaje).toContain("Piso 1 (abajo): 1 libra");
    expect(mensaje).toContain("Estimado: desde $95.000.");
    expect(mensaje).not.toContain("COP");
    expect(mensaje).not.toContain("La recojo en casa");
  });

  it("agrega nombre, fecha, entrega y notas", () => {
    const mensaje = armarMensajeWhatsApp(pisos, 95000, {
      ...base,
      correo: "ana@example.com",
      direccion: "Calle 1 #2-3",
      notas: "Es para el cumpleaños de mi mamá.",
    });

    expect(mensaje).toContain("Hola Elvi, soy Ana");
    expect(mensaje).toContain("14 de noviembre");
    expect(mensaje).toContain("La recojo en casa.");
    expect(mensaje).toContain("mi correo es ana@example.com.");
    expect(mensaje).toContain("Es para el cumpleaños de mi mamá.");
    expect(mensaje).not.toContain("Calle 1 #2-3");
    expect(mensaje).not.toContain("COP");
  });

  it("incluye la dirección cuando es a domicilio", () => {
    const mensaje = armarMensajeWhatsApp(pisos, 95000, {
      ...base,
      entrega: "domicilio",
      direccion: "Calle 1 #2-3",
    });

    expect(mensaje).toContain("La necesito a domicilio: Calle 1 #2-3.");
    expect(mensaje).not.toContain("La recojo en casa.");
  });
});
