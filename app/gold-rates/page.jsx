import Link from 'next/link';
import { CITIES, citySlug } from '../../lib/cities';

export const metadata = {
  title: 'Gold Rates Today - All Cities',
  description: 'Live 24K, 22K and 18K gold rates today across major Indian cities.',
};

export default function GoldRatesIndex() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gold Rates Today</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Select your city to see today's 24K, 22K and 18K gold rates.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/gold-rates/${citySlug(city)}`}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 hover:border-yellow-400 hover:text-yellow-700 transition-colors"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
