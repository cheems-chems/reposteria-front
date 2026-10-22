import { cn } from '@/lib/cn';
import { formatCOP } from '@/lib/format';

interface PriceSealProps {
	amount: number;
	size?: 'sm' | 'md' | 'lg';
	/** Precio anterior tachado (si el backend envía descuento). */
	compareAt?: number | null;
	/** Hace el pop del precio al pasar el mouse sobre la tarjeta contenedora. */
	groupPop?: boolean;
	/** Texto pequeño antes del valor, dentro del sello (p. ej. "Desde"). */
	prefix?: string;
	className?: string;
}

const sizes = {
	sm: 'text-base',
	md: 'text-xl',
	lg: 'text-3xl',
};

/** Porcentaje real de descuento; 0 cuando no lo hay (nada inventado). */
function discountPercent(amount: number, compareAt?: number | null): number {
	if (!compareAt || compareAt <= amount) return 0;
	const pct = Math.round((1 - amount / compareAt) * 100);
	return Math.min(99, Math.max(1, pct));
}

/** Sello de precio con cifras tabulares; el precio siempre es el del servidor. */
export function PriceSeal({
	amount,
	size = 'md',
	compareAt,
	groupPop = false,
	prefix,
	className,
}: PriceSealProps) {
	const hasDiscount = Boolean(compareAt && compareAt > amount);
	const pct = discountPercent(amount, compareAt);

	return (
		<span className={cn('inline-flex flex-col items-start', className)}>
			<span
				className={cn(
					'mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-ticket border border-fucsia/60 bg-tarjeta px-2.5 py-1',
					'origin-left transition-transform duration-200 ease-suave',
					groupPop &&
						'group-hover:scale-[1.06] motion-reduce:group-hover:scale-100',
				)}
			>
				{prefix ? (
					<span className="-mr-1 font-sans text-sm font-medium text-texto-suave">
						{prefix}{' '}
					</span>
				) : null}
				<span
					className={cn(
						'tabular font-serif font-bold text-fucsia',
						sizes[size],
					)}
				>
					{formatCOP(amount)}
				</span>
				{hasDiscount ? (
					<span className="tabular text-sm text-texto-suave line-through">
						{formatCOP(compareAt!)}
					</span>
				) : null}
				{pct > 0 ? (
					<span className="oferta tabular relative isolate overflow-hidden rounded-ticket bg-fucsia px-1.5 py-0.5 self-center font-sans text-[11px] font-bold leading-none text-white">
						-{pct}%
					</span>
				) : null}
			</span>
		</span>
	);
}
