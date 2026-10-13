import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/store/page-header";
import { EncargoFlow } from "@/components/store/encargo-flow";
import { Skeleton } from "@/components/states/skeleton";
import { getProducts, getStoreInfo } from "@/lib/api";

export const metadata: Metadata = {
  title: "Hacer un encargo",
  description:
    "Arma tu encargo paso a paso y envíalo por WhatsApp con el mensaje listo.",
};

function FlowSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />
      <div className="flex flex-col gap-4 rounded-(--radius-soft) border border-linea bg-papel p-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-32 self-end" />
      </div>
    </div>
  );
}

async function EncargoLoader({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  const [products, store, params] = await Promise.all([
    getProducts(),
    getStoreInfo(),
    searchParams,
  ]);

  return (
    <EncargoFlow
      products={products}
      whatsapp={store.whatsapp ?? null}
      initialProductSlug={params.producto}
    />
  );
}

export default function EncargoPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Encargo"
        title="Armemos tu encargo"
        description="Responde unas preguntas y te dejamos el mensaje listo para enviar por WhatsApp."
        className="mb-8"
      />
      <Suspense fallback={<FlowSkeleton />}>
        <EncargoLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
