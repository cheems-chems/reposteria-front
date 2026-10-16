import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/store/page-header';
import { ButtonLink } from '@/components/ui/button-link';
import { brand } from '@/lib/brand';
import { getStoreInfo } from '@/lib/api';

export const metadata = {
	title: 'Nosotros',
	description: 'Hecho en casa, pensado para compartir.',
};

export default async function NosotrosPage() {
	const store = await getStoreInfo();

	return (
		<main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
			<PageHeader
				eyebrow="Nosotros"
				title="Hecho en casa"
				description={store.description ?? undefined}
			/>

			<div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-vino/90">
				<p>
					Elvi&apos;s nace de cocinar en casa, para la gente que queremos. Cada
					pedido se prepara en tandas pequeñas, cerca de la fecha en que lo
					necesitas
					{store.city ? `, en ${store.city}` : ''}.
				</p>
				<p>
					Elegimos ingredientes seleccionados y tiempos reales de anticipación.
					Nos gusta el trato directo: conversamos cada encargo y lo confirmamos
					contigo por WhatsApp.
				</p>
			</div>

			<div className="mt-10 grid gap-6 sm:grid-cols-3">
				{[
					{
						title: 'Hecho en casa',
						text: 'Cocinamos en tandas pequeñas, cerca de tu fecha.',
					},
					{
						title: 'Ingredientes seleccionados',
						text: 'Elegimos cada ingrediente con cuidado.',
					},
					{
						title: 'Perfectos para cualquier ocasión',
						text: 'Dulces y salados para compartir.',
					},
				].map((item) => (
					<div
						key={item.title}
						className="flex flex-col gap-2 border-t-2 border-rosa-medio pt-3"
					>
						<h2 className="font-serif text-xl text-vino">{item.title}</h2>
						<p className="text-sm text-texto-suave">{item.text}</p>
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

			<p className="mt-8 text-sm text-texto-suave">
				¿Buscas algo puntual?{' '}
				<Link
					href="/contacto"
					className="text-fucsia-hover underline decoration-rosa-medio underline-offset-4 hover:text-vino"
				>
					Escríbenos
				</Link>
				.
			</p>
		</main>
	);
}
