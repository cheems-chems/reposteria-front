import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function RootNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <Logo size="md" href={null} />
      <h1 className="font-serif text-3xl text-vino">Página no encontrada</h1>
      <p className="max-w-md text-sm text-texto-suave">
        La dirección que abriste no existe. Vuelve al inicio o entra a la
        tienda.
      </p>
      <nav className="flex gap-5 text-sm">
        <Link
          className="text-fucsia-hover underline decoration-rosa-medio underline-offset-4 hover:text-vino"
          href="/"
        >
          Inicio
        </Link>
        <Link
          className="text-fucsia-hover underline decoration-rosa-medio underline-offset-4 hover:text-vino"
          href="/tienda"
        >
          Tienda
        </Link>
        <Link
          className="text-fucsia-hover underline decoration-rosa-medio underline-offset-4 hover:text-vino"
          href="/contacto"
        >
          Contacto
        </Link>
      </nav>
    </main>
  );
}
