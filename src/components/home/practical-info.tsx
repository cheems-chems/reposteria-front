import { SectionHeading } from '@/components/home/decor';
import { Reveal } from '@/components/home/reveal';
import { practicalInfo, type PracticalItem } from '@/content/home';

const ICONS: Record<PracticalItem['icon'], string> = {
	entrega:
		'M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1 1 13 0c0 4.8-6.5 10-6.5 10Zm0-7.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z',
	tiempo: 'M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z',
	horario:
		'M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z',
};

/** Franja práctica: entrega, anticipación y horario (textos de ejemplo editables). */
export function PracticalInfo() {
	return (
		<section className="relative isolate">
			<div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
				<Reveal>
					<SectionHeading title="Información para tu pedido" />
				</Reveal>
				<ul className="mt-10 grid gap-4 sm:grid-cols-3">
					{practicalInfo.map((item, index) => (
						<Reveal key={item.title} delay={index * 80} className="h-full">
							<li className="flex h-full flex-col gap-3 rounded-soft border border-borde bg-white p-5">
								<span className="flex size-11 items-center justify-center rounded-full bg-fucsia/10 text-fucsia">
									<svg
										viewBox="0 0 24 24"
										className="size-6"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.6}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d={ICONS[item.icon]} />
									</svg>
								</span>
								<h3 className="font-serif text-lg text-vino sm:text-xl">
									{item.title}
								</h3>
								<p className="text-[15px] text-texto sm:text-base">
									{item.text}
								</p>
							</li>
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}
