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
		imageUrl: '/img/productos/dulces/tortas-personalizadas/01.webp',
		shortDescription: 'Hecho en casa, por encargo.',
		description: 'Hecho en casa, por encargo.',
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
		price: 28000, // EJEMPLO: precio por confirmar.
		available: true,
		featured: true,
		imageUrl: null,
		shortDescription: 'Hecho en casa, por encargo.',
		description: 'Hecho en casa, por encargo.',
		ingredients: [],
		allergens: null,
		prepDays: null,
	},
];
