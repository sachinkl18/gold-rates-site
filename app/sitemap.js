import { CITIES, citySlug } from '../lib/cities';

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://gold-rates-site.vercel.app';
  const now = new Date();

  const staticRoutes = [
    '',
    '/gold-rates',
    '/silver-rates',
    '/gold-calculator',
    '/currency-converter',
    '/news',
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: route === '' ? 1 : 0.8,
  }));

  const cityRoutes = CITIES.flatMap((city) => [
    {
      url: `${base}/gold-rates/${citySlug(city)}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${base}/silver-rates/${citySlug(city)}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
  ]);

  return [...staticRoutes, ...cityRoutes];
}
