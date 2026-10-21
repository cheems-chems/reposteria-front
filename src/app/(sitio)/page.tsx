import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductTicket } from '@/components/product/product-ticket';
import {
	SectionHeading,
	WaveDivider,
} from '@/components/home/decor';
import Image from 'next/image';
import { ComboArt } from '@/components/home/combo-art';
import { PracticalInfo } from '@/components/home/practical-info';
import { HeroSeal } from '@/components/home/hero-art';
import { SectionCircle } from '@/components/home/section-circle';
import { Reveal } from '@/components/home/reveal';
import { ButtonLink } from '@/components/ui/button-link';
import { sectionArtKey } from '@/components/ui/section-art';

// Selección de "Los más pedidos": ids del catálogo existente (ver src/lib/api/tienda/).
const FEATURED_IDS = [
	'cookies',
	'tortas-personalizadas',
	'bandeja-deditos-de-queso',
	'combo-1',
];
const HERO_IMAGE = '/img/heroRosa.png';
const HERO_ALT = 'Torta rosada de tres pisos';
const HERO_TEXTO =
	'Tortas, postres y pasabocas hechos por Elvi, a tu gusto. Arma tu pedido y lo confirmamos por WhatsApp.';

// Destellos rosados alrededor de la torta (posición relativa al círculo fucsia).
const HERO_SPARKLES: { className: string; delay: string }[] = [
	{ className: '-top-5 -left-7', delay: '0s' },
	{ className: '-top-3 -right-6', delay: '1.5s' },
	{ className: '-bottom-4 -left-5', delay: '3s' },
	{ className: 'bottom-24 -right-4', delay: '0.75s' },
];
import {
	orderLineForProduct,
	productPrice,
	productTypeLabel,
} from '@/lib/encargo';
import {
	getCategories,
	getComboItems,
	getFeaturedProducts,
	getProducts,
	getSections,
	type ProductListItem,
} from '@/lib/api';
import { getCardImage } from '@/lib/galeria';
import {
	bannerCombo,
	comoFuncionaSteps,
	faqs,
	sectionBlurb,
	trust,
} from '@/content/home';

export default async function HomePage() {
	const [sections, featured, comboItems, products, categories] =
		await Promise.all([
			getSections(),
			getFeaturedProducts(),
			getComboItems(),
			getProducts(),
			getCategories(),
		]);

	const bannerComboProduct = featured.find((p) => p.saleMode === 'combo') ?? null;

	const productsById = new Map(products.map((product) => [product.slug, product]));
	const moreProducts = FEATURED_IDS.map((id) => productsById.get(id)).filter(
		(product): product is ProductListItem => Boolean(product),
	);
	const moreProductImages = moreProducts.map((product) =>
		getCardImage(product.slug, product.imageUrl),
	);

	const sectionByCategory = new Map(
		categories
			.filter((category) => category.sectionSlug)
			.map((category) => [category.slug, category.sectionSlug as string]),
	);
	const countBySection = new Map<string, number>();
	for (const product of products) {
		const sectionSlug = sectionByCategory.get(product.categorySlug);
		if (sectionSlug) {
			countBySection.set(
				sectionSlug,
				(countBySection.get(sectionSlug) ?? 0) + 1,
			);
		}
	}

	const comboArtKey = sectionArtKey(
		bannerComboProduct?.slug,
		bannerComboProduct?.name,
	);

	return (
		<main className="flex flex-1 flex-col">
			<section className="relative isolate overflow-x-clip">
				<div className="relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:py-20">
					<div className="relative z-10 flex min-w-0 flex-col items-start gap-5">
						<h1 className="animate-entrada font-serif text-4xl leading-[1.05] text-vino sm:text-5xl lg:text-6xl">
							Hecho en casa,
							<br />
							pensado para <span className="text-fucsia">compartir.</span>
						</h1>
						<p
							className="animate-entrada max-w-md text-lg text-texto"
							style={{ animationDelay: '120ms' }}
						>
							{HERO_TEXTO}
						</p>
						<div
							className="animate-entrada mt-1 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:justify-start"
							style={{ animationDelay: '240ms' }}
						>
							<ButtonLink href="/tienda" size="lg" className="w-full sm:w-auto">
								Ver la tienda
							</ButtonLink>
							<ButtonLink
								href="/encargo?categoria=combos&modo=armar"
								size="lg"
								variant="secondary"
								className="w-full sm:w-auto"
							>
								Arma tu combo
							</ButtonLink>
						</div>
					</div>

					<div className="relative z-0 mx-auto w-full min-w-0 max-w-xl lg:mx-0 lg:-mr-12 lg:max-w-none">
						<div className="relative mx-auto flex w-full max-w-85 justify-center sm:max-w-md lg:max-w-none">
							<span
								aria-hidden="true"
								className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fucsia sm:size-64 lg:size-80"
							>
								<span className="absolute -top-4 right-2 size-14 animate-flotar rounded-full bg-rosa-medio sm:size-20 lg:size-24" />
								<span className="absolute -bottom-4 left-1 size-12 animate-flotar-lento rounded-full bg-rosa-claro sm:size-16 lg:size-20" />
								{HERO_SPARKLES.map((sparkle) => (
									<span
										key={sparkle.className}
										className={`absolute size-3 animate-destello text-fucsia/60 sm:size-4 ${sparkle.className}`}
										style={{ animationDelay: sparkle.delay }}
									>
										<svg
											viewBox="0 0 24 24"
											className="size-full"
											fill="currentColor"
											aria-hidden="true"
										>
											<path d="M12 0c.9 6.6 5.5 11.1 12 12-6.5.9-11.1 5.4-12 12-.9-6.6-5.5-11.1-12-12C6.5 11.1 11.1 6.6 12 0Z" />
										</svg>
									</span>
								))}
							</span>
							<Image
								src={HERO_IMAGE}
								alt={HERO_ALT}
								priority
								width={1537}
								height={1023}
								sizes="(max-width: 640px) 435px, (max-width: 1024px) 530px, 660px"
								className="pointer-events-none relative z-10 h-72 w-auto max-w-none shrink-0 animate-torta object-contain drop-shadow-[0_24px_45px_rgba(90,18,51,0.22)] sm:h-88 lg:h-109"
							/>
							<HeroSeal />
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 mx-auto mt-8 w-full max-w-6xl px-5 sm:mt-10 sm:px-8">
				<div className="rounded-2xl border border-borde bg-white shadow-[0_20px_60px_rgba(90,18,51,0.08)]">
					<ul className="grid grid-cols-1 divide-y divide-borde/60 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-5">
						{trust.map((item) => (
							<li
								key={item.text}
								className="flex items-center gap-3 py-3 sm:px-5 sm:py-4"
							>
								<svg
									viewBox="0 0 24 24"
									className="size-7 shrink-0 text-fucsia sm:size-8"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.6}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d={item.path} />
								</svg>
								<span className="text-sm text-vino/90 sm:text-[15px]">
									{item.text}
								</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="relative isolate">
				<div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
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
						<div className="mt-12 grid w-full grid-cols-1 items-start justify-items-center gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-8">
							{sections.map((section, index) => (
								<SectionCircle
									key={section.slug}
									section={section}
									art={sectionArtKey(section.slug, section.name)}
									blurb={sectionBlurb(section.slug)}
									productCount={countBySection.get(section.slug) ?? 0}
									index={index}
								/>
							))}
						</div>
					) : (
						<p className="mt-8 text-center text-texto-suave">
							Estamos organizando el catálogo. Vuelve pronto.
						</p>
					)}
				</div>
			</section>

			{moreProducts.length > 0 ? (
				<section className="relative isolate">
					<div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
						<Reveal>
							<SectionHeading
								title="Los más pedidos"
							/>
						</Reveal>
						<div className="mt-10 grid auto-rows-fr grid-cols-2 items-stretch gap-4 lg:grid-cols-4">
							{moreProducts.map((product, index) => {
								const line = product.available
									? orderLineForProduct(product, comboItems)
									: null;
								return (
									<Reveal
										key={product.slug}
										delay={Math.min(index, 7) * 60}
										className="h-full"
									>
										<ProductTicket
											imageLoading={index < 2 ? 'eager' : 'lazy'}
											imageSizes="(max-width: 639px) calc((100vw - 3.5rem) / 2 - 1rem), (max-width: 1023px) calc((100vw - 5rem) / 2 - 1rem), (max-width: 1279px) calc((100vw - 11rem) / 4), 15.125rem"
											art={sectionArtKey(product.categorySlug, product.categoryName)}
											product={{
												slug: product.slug,
												name: product.name,
												price: productPrice(product),
												category: product.categoryName,
												imageUrl: moreProductImages[index] ?? null,
												available: product.available,
												compareAt: product.compareAt,
												featured: product.featured,
												typeLabel: productTypeLabel(product),
											}}
											action={
												line ? (
													<AddToCartButton line={line} size="sm" fullWidth />
												) : undefined
											}
											className="h-full"
										/>
									</Reveal>
								);
							})}
						</div>
					</div>
				</section>
			) : null}

			<PracticalInfo />

			{/* Banda "Arma tu combo": la forma ondulada la pinta la propia banda
			    (ondas fucsia + cuerpo con degradado). Todo lo que queda fuera de
			    la onda es transparente, así se ve el fondo del body con las volitas. */}
			<section className="relative">
				{/* Tira superior: borde ondulado arriba (hacia afuera) y plano abajo,
				    pegado al cuerpo. -mb-px evita la costura de 1px. */}
				<WaveDivider fill="var(--color-combo-from)" className="-mb-px" />

				<div
					className="relative"
					style={{
						backgroundImage:
							'linear-gradient(180deg, var(--color-combo-from) 0%, var(--color-combo-to) 100%)',
					}}
				>
					<div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-14 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-16">
						<div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
							<h2 className="font-serif text-[2.5rem] leading-[1.05] text-white sm:text-[3.4rem]">
								{bannerCombo.title}
							</h2>
							<p className="max-w-[38ch] text-[1.1rem] font-normal leading-[1.6] text-white/[0.92]">
								{bannerCombo.text}
							</p>
							<ButtonLink
								href="/encargo?categoria=combos&modo=armar"
								size="lg"
								variant="inverse"
								className="group mt-1 px-9 py-4 text-xl font-bold sm:px-10"
							>
								<span className="font-bold">{bannerCombo.cta}</span>
								<span
									aria-hidden="true"
									className="transition-transform duration-200 ease-suave group-hover:translate-x-1"
								>
									→
								</span>
							</ButtonLink>
						</div>
						<div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:mx-0">
							<ComboArt art={comboArtKey} />
						</div>
					</div>
				</div>

				{/* Tira inferior: borde plano arriba, pegado al cuerpo, y ondulado
				    abajo (hacia afuera). -mt-px evita la costura de 1px. */}
				<WaveDivider fill="var(--color-combo-to)" flip className="-mt-px" />
			</section>

			<section className="relative isolate overflow-x-clip">
				<div className="relative mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 lg:py-24">
					<header className="mx-auto max-w-2xl text-center">
						<h2 className="font-serif text-3xl text-vino sm:text-4xl">
							Cómo funciona
						</h2>
						<span
							aria-hidden="true"
							className="mx-auto mt-3 block h-1 w-12 rounded-full bg-fucsia"
						/>
					</header>
					<ol className="relative mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
						<span
							aria-hidden="true"
							className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-7 hidden border-t-2 border-dashed border-rosa-medio sm:block"
						/>
						{comoFuncionaSteps.map((step, index) => (
							<li
								key={step.title}
								className="relative flex flex-col items-center gap-4 text-center"
							>
								<span className="relative z-10 flex size-14 items-center justify-center rounded-full bg-fucsia font-serif text-2xl text-white">
									{index + 1}
								</span>
								<h3 className="font-serif text-xl text-vino">{step.title}</h3>
								<p className="max-w-xs font-sans text-base text-vino/80">
									{step.text}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
				<Reveal>
					<SectionHeading title="Preguntas frecuentes" />
				</Reveal>
				<div className="mt-8 flex flex-col gap-3">
					{faqs.map((faq) => (
						<details
							key={faq.question}
							className="group rounded-soft border border-borde bg-white px-4 py-3 open:border-fucsia/50"
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
