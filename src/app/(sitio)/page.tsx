import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductGrid } from '@/components/store/product-grid';
import {
	CheckList,
	FloatingDots,
	Marquee,
	SectionHeading,
	WaveDivider,
} from '@/components/home/decor';
import { HeroArt } from '@/components/home/hero-art';
import { ReviewsBlock } from '@/components/home/reviews-block';
import { SectionCircle } from '@/components/home/section-circle';
import { Reveal } from '@/components/home/reveal';
import { ButtonLink } from '@/components/ui/button-link';
import { PriceSeal } from '@/components/ui/price-seal';
import { SafeImage } from '@/components/ui/safe-image';
import {
	SectionArt,
	sectionArtKey,
	sectionArtTheme,
} from '@/components/ui/section-art';
import { orderLineForProduct } from '@/lib/encargo';
import {
	getCategories,
	getComboItems,
	getFeaturedProducts,
	getProducts,
	getReviews,
	getSections,
	getStoreInfo,
	type ComboProduct,
} from '@/lib/api';
import { brand } from '@/lib/brand';
import {
	bannerCombo,
	comoFuncionaSteps,
	faqs,
	marqueePhrases,
	sectionBlurb,
	trust,
} from '@/content/home';

export default async function HomePage() {
	const [sections, store, featured, comboItems, products, categories, reviews] =
		await Promise.all([
			getSections(),
			getStoreInfo(),
			getFeaturedProducts(),
			getComboItems(),
			getProducts(),
			getCategories(),
			getReviews(),
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

	// En desarrollo se muestran ejemplos con etiqueta EJEMPLO; en producción solo reseñas reales.
	const visibleReviews = reviews.filter((review) => !review.example);

	const comboTheme = sectionArtTheme(
		sectionArtKey(highlightCombo?.slug, highlightCombo?.name),
	);
	const comboArtPanel = (
		<span
			aria-hidden="true"
			className={`absolute inset-0 flex items-center justify-center ${comboTheme.tile}`}
		>
			<SectionArt
				art={sectionArtKey(highlightCombo?.slug, highlightCombo?.name)}
				className={`w-28 sm:w-36 ${comboTheme.ink}`}
			/>
		</span>
	);

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
					<div className="relative z-10 flex flex-col items-start gap-5">
						<h1 className="font-serif text-4xl leading-[1.05] text-vino sm:text-5xl lg:text-6xl">
							Hecho en casa,
							<br />
							pensado para <span className="text-fucsia">compartir.</span>
						</h1>
						<p className="max-w-md text-lg text-texto">
							{store.description ?? brand.description}
						</p>
						<div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
							<ButtonLink href="/tienda" size="lg" className="w-full sm:w-auto">
								Ver la tienda
							</ButtonLink>
							<ButtonLink
								href="/encargo?categoria=combos"
								size="lg"
								variant="secondary"
								className="w-full sm:w-auto"
							>
								Arma tu combo
							</ButtonLink>
						</div>
					</div>

					<div className="relative z-0 mx-auto w-full max-w-xl lg:mx-0 lg:-mr-12 lg:max-w-none">
						<span
							aria-hidden="true"
							className="absolute -inset-4 rounded-[2.5rem] bg-rosa-claro/60"
						/>
						{/* Para usar foto real: coloca el archivo en public/brand/hero.jpg y pon brand.hero.image = "/brand/hero.jpg" en src/lib/brand.ts */}
						{brand.hero.image ? (
							<div className="relative h-64 w-full overflow-hidden sm:h-80 lg:aspect-3/2 lg:h-auto">
								<SafeImage
									src={brand.hero.image}
									alt={brand.hero.alt}
									fill
									priority
									sizes="(max-width: 1024px) 92vw, 560px"
									className="object-contain object-bottom drop-shadow-[0_24px_45px_rgba(90,18,51,0.22)]"
									fallback={<HeroArt />}
								/>
							</div>
						) : (
							<HeroArt />
						)}
					</div>
				</div>
			</section>

			<section className="border-y border-borde bg-tarjeta">
				<ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-8 sm:gap-x-6 sm:gap-y-6 sm:px-8 lg:grid-cols-4">
					{trust.map((item) => (
						<li key={item.label} className="flex items-start gap-3">
							<svg
								viewBox="0 0 24 24"
								className="size-6 shrink-0 text-fucsia sm:size-7"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.6}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d={item.path} />
							</svg>
							<span className="font-sans text-xs leading-snug font-medium text-vino sm:text-sm">
								{item.label}
							</span>
						</li>
					))}
				</ul>
			</section>

			<section className="relative overflow-x-clip border-b border-borde bg-rosa-claro/40">
				<FloatingDots className="left-6 top-10 hidden text-fucsia/40 sm:block" />
				<span
					aria-hidden="true"
					className="absolute -right-28 top-1/2 hidden size-80 -translate-y-1/2 rounded-full bg-rosa-medio/70 lg:block"
				/>
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
						<div className="mt-12 grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-8">
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

			{highlightCombo ? (
				<section className="relative overflow-x-clip bg-lienzo">
					<FloatingDots className="right-6 top-24 hidden text-rosa-medio sm:block" />
					<div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
						<Reveal>
							<div className="grid items-center gap-10 lg:grid-cols-2">
								<div className="relative">
									<span
										aria-hidden="true"
										className="absolute -inset-3 rounded-2rem bg-white/70"
									/>
									<div className="relative aspect-4/3 w-full overflow-hidden rounded-soft border border-borde bg-tarjeta">
										{highlightCombo.imageUrl ? (
											<SafeImage
												src={highlightCombo.imageUrl}
												alt={highlightCombo.name}
												fill
												sizes="(max-width: 1024px) 92vw, 520px"
												className="object-cover"
												fallback={comboArtPanel}
											/>
										) : (
											comboArtPanel
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
											className="w-full sm:w-auto"
										>
											Encargar
										</ButtonLink>
										{highlightLine ? (
											<AddToCartButton
												line={highlightLine}
												size="lg"
												variant="secondary"
												className="w-full sm:w-auto"
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
				<section className="relative overflow-x-clip border-t border-borde bg-tarjeta">
					<span
						aria-hidden="true"
						className="absolute -bottom-24 -left-20 hidden size-64 rounded-full bg-rosa-claro lg:block"
					/>
					<div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
						<Reveal>
							<SectionHeading
								title="Los más pedidos"
								description="Una muestra de lo que más nos encargan."
							/>
						</Reveal>
						<Reveal delay={80} className="mt-10">
							<ProductGrid products={moreProducts} comboItems={comboItems} />
						</Reveal>
					</div>
				</section>
			) : null}

			<Marquee phrases={marqueePhrases} />

			<ReviewsBlock reviews={visibleReviews} />

			<section className="relative overflow-x-clip bg-fucsia">
				<WaveDivider className="text-tarjeta" />
				<div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2">
					<div className="flex flex-col items-start gap-4">
						<h2 className="font-serif text-3xl text-white sm:text-4xl">
							{bannerCombo.title}
						</h2>
						<p className="max-w-md text-lg text-white">{bannerCombo.text}</p>
						<ButtonLink
							href="/encargo?categoria=combos"
							size="lg"
							variant="inverse"
							className="mt-1"
						>
							{bannerCombo.cta}
						</ButtonLink>
					</div>
					<div aria-hidden="true" className="relative hidden h-40 lg:block">
						<span className="absolute right-8 top-0 size-40 rounded-full bg-white/15 animate-flotar" />
						<span className="absolute bottom-0 right-40 size-24 rounded-full bg-white/10 animate-flotar-lento" />
					</div>
				</div>
				<WaveDivider className="text-vino" flip />
			</section>

			<section className="relative overflow-x-clip bg-vino">
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
						{comoFuncionaSteps.map((step, index) => (
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
