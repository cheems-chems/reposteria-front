/* Sección Dulces. Precios de Cupcakes y tortas personalizadas por confirmar (EJEMPLO). */

import type { Category, Product, Section } from '../types';

export const DULCES_SECTIONS: Section[] = [
	{ slug: 'dulces', name: 'Dulces', orden: 1, imageUrl: null as string | null },
];

export const DULCES_CATEGORIES: Category[] = [
	{
		slug: 'dulces',
		name: 'Dulces',
		description: 'Dulces hechos en casa, por encargo.',
		sectionSlug: 'dulces',
		imageUrl: null as string | null,
	},
];

export const DULCES_PRODUCTS: Product[] = [
	{
		slug: 'tortas-personalizadas',
		name: 'Tortas personalizadas',
		categorySlug: 'dulces',
		categoryName: 'Dulces',
		saleMode: 'single',
		purchaseMode: 'customizable',
		price: 28000, // EJEMPLO: precio por confirmar.
		available: true,
		featured: true,
		imageUrl: [
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-01.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-02.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-03.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-04.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-05.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-06.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-07.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-08.webp',
			'/img/productos/dulces/tortas-personalizadas/tortas-personalizadas-09.webp',
		],
		shortDescription: 'Diseñada a tu gusto para tu celebración.',
		description: 'Tortas hechas a tu medida. El precio parte desde $35.000 y depende del sabor y la decoración. Cuéntanos tu idea y la hacemos realidad.',
		ingredients: [],
		allergens: null,
		prepDays: null,
	},
	{
		slug: 'cookies',
		name: 'Cupcakes',
		categorySlug: 'dulces',
		categoryName: 'Dulces',
		saleMode: 'single',
		purchaseMode: 'direct',
		price: 38000,
		unitLabel: 'docena',
		unitCount: 12,
		available: true,
		featured: true,
		imageUrl: [
			'/img/productos/dulces/cookies/cookies-01.webp',
			'/img/productos/dulces/cookies/cookies-02.webp',
			'/img/productos/dulces/cookies/cookies-03.webp',
		],
		shortDescription: 'Docena de cupcakes decorados, hechos en casa.',
		description: 'Cupcakes hechos en casa para fiestas, regalos y antojos. Se venden por docena. Cuéntanos la ocasión y los armamos para ti.',
		ingredients: [],
		allergens: null,
		prepDays: null,
	},
];
