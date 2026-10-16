import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductGrid } from '@/components/store/product-grid';
import {
	CheckList,
	FloatingDots,
	Marquee,
	SectionHeading,
	WaveDivider,
} from '@/components/home/decor';
import { Reveal } from '@/components/home/reveal';
import { ButtonLink } from '@/components/ui/button-link';
import { PhotoPlaceholder } from '@/components/ui/photo-placeholder';
import { PriceSeal } from '@/components/ui/price-seal';
import { orderLineForProduct } from '@/lib/encargo';
import {
	getComboItems,
	getFeaturedProducts,
	getSections,
	getStoreInfo,
	type ComboProduct,
	type Section,
} from '@/lib/api';
import { brand } from '@/lib/brand';

const trust: { label: string; path: string }[] = [
	{
		label: 'Hechos en casa',
		path: 'M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M10 21v-6h4v6',
	},
	{
		label: 'Ingredientes seleccionados',
		path: 'M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0c2-5 6-9 11-11',
	},
	{
		label: 'Perfectos para cualquier ocasión',
		path: 'M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5 8.6 8.6M15.4 15.4l2.1 2.1M17.5 6.5 15.4 8.6M8.6 15.4 6.5 17.5',
	},
	{
		label: 'Pedidos por encargo vía WhatsApp',
		path: 'M4 5h16v11H9l-5 4V5Z',
	},
];

const marqueePhrases = [
	'Hecho en casa',
	'Ingredientes seleccionados',
	'Perfectos para cualquier ocasión',
	'Pedidos por encargo vía WhatsApp',
	'El sabor que une, lo hacemos con amor',
];

const faqs: { question: string; answer: string }[] = [
	{
		question: '¿Cómo hago un pedido?',
		answer:
			'Eliges lo que quieras en la tienda, agregas al encargo o escribes por WhatsApp y te confirmamos la fecha y el valor.',
	},
	{
		question: '¿Con cuánta anticipación debo pedir?',
		answer:
			'Los pedidos son por encargo. Cuando armas tu combo te indicamos la anticipación según el producto antes de confirmar.',
	},
	{
		question: '¿Puedo personalizar mi combo?',
		answer:
			'Sí. En “Arma tu combo” eliges los pasabocas por unidades y ajustas la mezcla a tu gusto.',
	},
	{
		question: '¿Hacen domicilios?',
		answer:
			'Coordinamos entrega o recogida por WhatsApp según la zona. Escríbenos y lo confirmamos contigo.',
	},
];

function SectionCircle({ section }: { section: Section }) {
	return (
		<Link
			href={`/tienda?seccion=${section.slug}`}
			className="group flex flex-col items-center gap-3 rounded-soft p-2 text-center transition-transform duration-200 ease-suave hover:-translate-y-1"
		>
			<span className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-rosa-medio ring-2 ring-transparent transition-shadow duration-200 ease-suave group-hover:ring-fucsia sm:size-36">
				{section.imageUrl ? (
					<Image
						src={section.imageUrl}
						alt={section.name}
						fill
						sizes="(max-width: 640px) 7rem, 9rem"
						className="object-cover"
					/>
				) : (
					<svg
						viewBox="0 0 120 120"
						className="w-12 text-vino/70 sm:w-14"
						fill="none"
						stroke="currentColor"
						strokeWidth={3}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M28 76c0-7 14-11 32-11s32 4 32 11v16c0 4-14 7-32 7s-32-3-32-7z" />
						<path d="M28 76c9 5 19 7 32 7s23-2 32-7" />
						<path d="M60 38v24" />
					</svg>
				)}
			</span>
			<span className="font-serif text-lg font-semibold text-vino">
				{section.name}
			</span>
		</Link>
	);
}

export default async function HomePage() {
	const [sections, store, featured, comboItems] = await Promise.all([
		getSections(),
		getStoreInfo(),
		getFeaturedProducts(),
		getComboItems(),
	]);

	const highlightCombo =
		featured.find((p): p is ComboProduct => p.saleMode === 'combo') ?? null;
	const comboComposition = highlightCombo
		? highlightCombo.composition.map((part) => ({
				name:
					comboItems.find((item) => item.slug === part.productSlug)?.name ??
					part.productSlug,
				quantity: part.quantity,
			}))
		: [];
	const highlightLine = highlightCombo
		? orderLineForProduct(highlightCombo, comboItems)
		: null;

	const withoutCombo = featured.filter((p) => p.slug !== highlightCombo?.slug);
	const moreProducts = withoutCombo.length > 0 ? withoutCombo : featured;

	return (
		<main className="flex flex-1 flex-col">
			<section className="relative overflow-x-clip bg-lienzo">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 overflow-hidden"
				>
					<span className="absolute -bottom-28 -left-16 size-64 rounded-full bg-rosa-medio sm:size-80" />
					<span className="absolute -top-10 right-1/4 size-40 rounded-full bg-rosa-claro animate-flotar-lento sm:size-56" />
					<span className="absolute -right-24 -top-24 hidden size-96 rounded-full bg-fucsia lg:block" />
					<span className="absolute -bottom-20 -right-10 hidden size-56 rounded-full bg-fucsia lg:block" />
				</div>

				<div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:py-20">
					<div className="flex flex-col items-start gap-5">
						<h1 className="font-serif text-4xl leading-[1.05] text-vino sm:text-5xl lg:text-6xl">
							Hecho en casa,
							<br />
							pensado para <span className="text-fucsia">compartir.</span>
						</h1>
						<p className="max-w-md text-lg text-texto">
							{store.description ?? brand.description}
						</p>
						<div className="mt-1 flex flex-col gap-3 sm:flex-row">
							<ButtonLink href="/tienda" size="lg">
								Ver la tienda
							</ButtonLink>
							<ButtonLink
								href="/encargo?categoria=combos"
								size="lg"
								variant="secondary"
							>
								Arma tu combo
							</ButtonLink>
						</div>
					</div>

					<div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:-mr-12 lg:max-w-none">
						<span
							aria-hidden="true"
							className="absolute -inset-4 rounded-[2.5rem] bg-rosa-claro/60"
						/>
						<div className="relative aspect-3/2 w-full">
							{brand.hero.image ? (
								<Image
									src={brand.hero.image}
									alt={brand.hero.alt}
									fill
									preload
									sizes="(max-width: 1024px) 92vw, 560px"
									className="object-contain object-bottom drop-shadow-[0_24px_45px_rgba(90,18,51,0.22)]"
								/>
							) : (
								<div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2rem border-2 border-dashed border-fucsia/40 bg-rosa-claro/70 p-6 text-center">
									<svg
										viewBox="0 0 120 120"
										className="w-14 text-fucsia/70"
										fill="none"
										stroke="currentColor"
										strokeWidth={3}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M28 76c0-7 14-11 32-11s32 4 32 11v16c0 4-14 7-32 7s-32-3-32-7z" />
										<path d="M28 76c9 5 19 7 32 7s23-2 32-7" />
										<path d="M60 38v24" />
									</svg>
									<p className="font-serif text-xl text-vino">Foto pendiente</p>
									<p className="font-sans text-[11px] uppercase tracking-[0.18em] text-texto-suave">
										Coloca public/brand/hero.jpg y actualiza brand.ts
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="border-y border-borde bg-tarjeta">
				<ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-6 px-5 py-8 sm:px-8 lg:grid-cols-4">
					{trust.map((item) => (
						<li key={item.label} className="flex items-center gap-3">
							<svg
								viewBox="0 0 24 24"
								className="size-7 shrink-0 text-fucsia"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.6}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d={item.path} />
							</svg>
							<span className="font-sans text-sm font-medium text-vino">
								{item.label}
							</span>
						</li>
					))}
				</ul>
			</section>

			<section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
				<header className="text-center">
					<h2 className="font-serif text-3xl text-vino sm:text-4xl">
						Compra por sección
					</h2>
					<span
						aria-hidden="true"
						className="mx-auto mt-3 block h-1 w-12 rounded-full bg-fucsia"
					/>
				</header>

				{sections.length > 0 ? (
					<div className="mt-10 grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 sm:gap-8">
						{sections.map((section) => (
							<SectionCircle key={section.slug} section={section} />
						))}
					</div>
				) : (
					<p className="mt-8 text-center text-texto-suave">
						Estamos organizando el catálogo. Vuelve pronto.
					</p>
				)}
			</section>

			{highlightCombo ? (
				<section className="relative overflow-x-clip bg-rosa-claro/40">
					<WaveDivider className="text-lienzo" />
					<FloatingDots className="right-6 top-24 hidden sm:block" />
					<div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
						<Reveal>
							<div className="grid items-center gap-10 lg:grid-cols-2">
								<div className="relative">
									<span
										aria-hidden="true"
										className="absolute -inset-3 rounded-2rem bg-white/60"
									/>
									<div className="relative aspect-4/3 w-full overflow-hidden rounded-soft border border-borde bg-tarjeta">
										{highlightCombo.imageUrl ? (
											<Image
												src={highlightCombo.imageUrl}
												alt={highlightCombo.name}
												fill
												sizes="(max-width: 1024px) 92vw, 520px"
												className="object-cover"
											/>
										) : (
											<PhotoPlaceholder
												name={highlightCombo.name}
												ratio="4/3"
												seed={highlightCombo.name.length * 7}
												className="border-0"
											/>
										)}
									</div>
								</div>

								<div className="flex flex-col items-start gap-5">
									<h2 className="font-serif text-3xl text-vino sm:text-4xl">
										{highlightCombo.name}
									</h2>
									{comboComposition.length > 0 ? (
										<CheckList items={comboComposition} />
									) : null}
									<PriceSeal amount={highlightCombo.price} size="lg" />
									<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
										<ButtonLink
											href={`/encargo?producto=${highlightCombo.slug}`}
											size="lg"
										>
											Encargar
										</ButtonLink>
										{highlightLine ? (
											<AddToCartButton
												line={highlightLine}
												size="lg"
												variant="secondary"
												label="Agregar al encargo"
											/>
										) : null}
									</div>
								</div>
							</div>
						</Reveal>
					</div>
				</section>
			) : null}

			{moreProducts.length > 0 ? (
				<section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
					<Reveal>
						<SectionHeading
							title="Los más pedidos"
							description="Una muestra de lo que más nos encargan."
						/>
					</Reveal>
					<Reveal delay={80} className="mt-10">
						<ProductGrid products={moreProducts} comboItems={comboItems} />
					</Reveal>
				</section>
			) : null}

			<Marquee phrases={marqueePhrases} />

			<section className="relative overflow-x-clip bg-fucsia">
				<WaveDivider className="text-lienzo" />
				<div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2">
					<div className="flex flex-col items-start gap-4">
						<h2 className="font-serif text-3xl text-white sm:text-4xl">
							Arma tu combo
						</h2>
						<p className="max-w-md text-lg text-white">
							Elige tus pasabocas favoritos por unidades y armamos contigo el
							combo perfecto para tu ocasión.
						</p>
						<ButtonLink
							href="/encargo?categoria=combos"
							size="lg"
							variant="inverse"
							className="mt-1"
						>
							Arma tu combo
						</ButtonLink>
					</div>
					<div aria-hidden="true" className="relative hidden h-40 lg:block">
						<span className="absolute right-8 top-0 size-40 rounded-full bg-white/15 animate-flotar" />
						<span className="absolute bottom-0 right-40 size-24 rounded-full bg-white/10 animate-flotar-lento" />
					</div>
				</div>
				<WaveDivider className="text-lienzo" flip />
			</section>

			<section className="relative overflow-x-clip bg-fucsia">
				<WaveDivider className="text-lienzo" />
				<div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
					<header className="mx-auto max-w-2xl text-center">
						<h2 className="font-serif text-3xl text-white sm:text-4xl">
							Cómo funciona
						</h2>
						<span
							aria-hidden="true"
							className="mx-auto mt-3 block h-1 w-12 rounded-full bg-white"
						/>
					</header>
					<ol className="mt-12 grid gap-10 sm:grid-cols-3">
						{[
							{
								title: 'Elige lo que quieras',
								text: 'Explora la tienda o arma tu combo a tu gusto.',
							},
							{
								title: 'Cuéntanos los detalles',
								text: 'Dinos fecha, ocasión y cualquier personalización.',
							},
							{
								title: 'Envía por WhatsApp',
								text: 'Te dejamos el mensaje listo y confirmamos el valor.',
							},
						].map((step, index) => (
							<li
								key={step.title}
								className="flex flex-col items-center gap-3 text-center"
							>
								<span className="flex size-12 items-center justify-center rounded-full border border-white/70 font-serif text-2xl text-white">
									{index + 1}
								</span>
								<h3 className="font-serif text-xl text-white">{step.title}</h3>
								<p className="max-w-xs font-sans text-sm text-white/90">
									{step.text}
								</p>
							</li>
						))}
					</ol>
				</div>
				<WaveDivider className="text-lienzo" flip />
			</section>

			<section className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
				<Reveal>
					<SectionHeading title="Preguntas frecuentes" />
				</Reveal>
				<div className="mt-8 flex flex-col gap-3">
					{faqs.map((faq) => (
						<details
							key={faq.question}
							className="group rounded-soft border border-borde bg-tarjeta px-4 py-3 open:border-fucsia/50"
						>
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-vino [&::-webkit-details-marker]:hidden">
								{faq.question}
								<span
									aria-hidden="true"
									className="text-xl text-fucsia transition-transform duration-200 ease-suave group-open:rotate-45"
								>
									+
								</span>
							</summary>
							<p className="mt-3 text-sm text-texto-suave">{faq.answer}</p>
						</details>
					))}
				</div>
			</section>
		</main>
	);
}
