import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/store/page-header';
import { ButtonLink } from '@/components/ui/button-link';
import { brand } from '@/lib/brand';
import { getStoreInfo } from '@/lib/api';

export const metadata = {
	title: 'Nosotros',
	description:
		'Un obrador de repostería por encargo: tandas pequeñas, horneado cerca de la entrega.',
};

export default async function NosotrosPage() {
	const store = await getStoreInfo();

	return (
		<main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
			<PageHeader
				eyebrow="Nosotros"
				title="Un obrador pequeño, por encargo"
				description={store.description ?? undefined}
			/>

			<div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-cacao/90">
				<p>
					Trabajamos en tandas pequeñas y horneamos cerca de la fecha de
					entrega. No tenemos vitrina de productos listos: cada encargo se
					prepara para el día que lo necesitas
					{store.city ? `, en ${store.city}` : ''}.
				</p>
				<p>
					La idea es simple: menos volumen, más cuidado. Elegimos ingredientes
					concretos, tiempos reales de anticipación y una conversación directa
					para confirmar cada pedido.
				</p>
			</div>

			<div className="mt-10 grid gap-6 sm:grid-cols-3">
				{[
					{
						title: 'Fresco, no de vitrina',
						text: 'Se hornea para tu fecha, no para tener stock.',
					},
					{
						title: 'Tiempos claros',
						text: 'Cada ficha indica con cuántos días avisar.',
					},
					{
						title: 'Trato directo',
						text: 'Confirmamos cada encargo por WhatsApp.',
					},
				].map((item) => (
					<div
						key={item.title}
						className="flex flex-col gap-2 border-t-2 border-kraft pt-3"
					>
						<h2 className="font-serif text-xl text-cacao">{item.title}</h2>
						<p className="text-sm text-tinta-suave">{item.text}</p>
					</div>
				))}
			</div>

			{brand.provisionalData ? (
				<Alert tone="warning" title="Marca provisional" className="mt-10">
					El nombre <strong>{brand.name}</strong> y estos textos son marcadores
					de posición. Se reemplazan por la identidad real del negocio.
				</Alert>
			) : null}

			<div className="mt-10 flex flex-col gap-3 sm:flex-row">
				<ButtonLink href="/tienda">Ver la tienda</ButtonLink>
				<ButtonLink href="/encargo" variant="secondary">
					Hacer un encargo
				</ButtonLink>
			</div>

			<p className="mt-8 text-sm text-tinta-suave">
				¿Buscas algo puntual?{' '}
				<Link
					href="/contacto"
					className="text-guayaba-tinta underline decoration-kraft underline-offset-4 hover:text-cacao"
				>
					Escríbenos
				</Link>
				.
			</p>
		</main>
	);
}
