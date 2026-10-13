"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { normalizeWhatsApp, whatsappUrl } from "@/lib/whatsapp";

interface ContactFormProps {
  /** WhatsApp del negocio (desde la configuración de la tienda). */
  whatsapp: string | null;
}

const TIPO_LABEL: Record<string, string> = {
  torta: "Torta",
  bizcocho: "Bizcocho",
  postre: "Postre",
  otro: "Otra cosa",
};

/**
 * Formulario de contacto. Mientras no exista POST /contact, el envío abre
 * WhatsApp con el mensaje ya armado. Validación local, sin backend.
 */
export function ContactForm({ whatsapp }: ContactFormProps) {
  const [values, setValues] = useState({
    nombre: "",
    contacto: "",
    tipo: "torta",
    mensaje: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  const waNumber = normalizeWhatsApp(whatsapp);

  function buildMessage(): string {
    return [
      "¡Hola! Quiero contactarlos.",
      "",
      `Nombre: ${values.nombre.trim()}`,
      `Contacto: ${values.contacto.trim()}`,
      `Asunto: ${TIPO_LABEL[values.tipo] ?? values.tipo}`,
      values.mensaje.trim() ? `Mensaje: ${values.mensaje.trim()}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.nombre.trim()) {
      next.nombre = "Escribí tu nombre, por favor.";
    }
    if (!values.contacto.trim()) {
      next.contacto = "Déjanos un correo o WhatsApp para responderte.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!waNumber) {
      setOpened(false);
      return;
    }
    window.open(whatsappUrl(waNumber, buildMessage()), "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full flex-col gap-4 rounded-(--radius-soft) border border-linea bg-papel p-5 sm:p-6"
    >
      <h2 className="font-serif text-2xl text-cacao">Cuéntanos qué necesitas</h2>
      <p className="text-sm text-tinta-suave">
        Al enviar, se abre WhatsApp con tu mensaje listo. Los encargos se
        confirman por ahí.
      </p>

      <Field label="Nombre" htmlFor="contacto-nombre" required error={errors.nombre}>
        <Input
          id="contacto-nombre"
          name="nombre"
          autoComplete="name"
          value={values.nombre}
          onChange={(e) => setValues((v) => ({ ...v, nombre: e.target.value }))}
          placeholder="Tu nombre"
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? "contacto-nombre-error" : undefined}
        />
      </Field>

      <Field
        label="Correo o WhatsApp"
        htmlFor="contacto-contacto"
        required
        error={errors.contacto}
        hint="Como prefieras que te contactemos."
      >
        <Input
          id="contacto-contacto"
          name="contacto"
          value={values.contacto}
          onChange={(e) =>
            setValues((v) => ({ ...v, contacto: e.target.value }))
          }
          placeholder="tucorreo@ejemplo.com o +57 300 000 0000"
          aria-invalid={Boolean(errors.contacto)}
          aria-describedby={
            errors.contacto ? "contacto-contacto-error" : "contacto-contacto-hint"
          }
        />
      </Field>

      <Field label="Qué te gustaría" htmlFor="contacto-tipo">
        <Select
          id="contacto-tipo"
          name="tipo"
          value={values.tipo}
          onChange={(e) => setValues((v) => ({ ...v, tipo: e.target.value }))}
        >
          <option value="torta">Torta</option>
          <option value="bizcocho">Bizcocho</option>
          <option value="postre">Postre</option>
          <option value="otro">Otra cosa</option>
        </Select>
      </Field>

      <Field label="Mensaje" htmlFor="contacto-mensaje">
        <Textarea
          id="contacto-mensaje"
          name="mensaje"
          value={values.mensaje}
          onChange={(e) =>
            setValues((v) => ({ ...v, mensaje: e.target.value }))
          }
          placeholder="Para cuándo lo necesitas, para cuántas personas, sabores…"
        />
      </Field>

      <Button type="submit" fullWidth disabled={!waNumber}>
        Enviar por WhatsApp
      </Button>

      {!waNumber ? (
        <Alert tone="warning" title="WhatsApp no configurado">
          Aún no hay número de WhatsApp en la configuración de la tienda.
          Edítalo en <code>src/lib/brand.ts</code> para activar el envío.
        </Alert>
      ) : null}

      {opened ? (
        <Alert tone="success" title="Casi listo">
          Abrimos WhatsApp con tu mensaje. Envíalo para que te respondamos.
        </Alert>
      ) : null}
    </form>
  );
}
