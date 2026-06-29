import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, citySlug, slugToCity } from '../../../lib/cities';

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: citySlug(city) }));
}

export async function generateMetadata({ params }) {
  const city = slugToCity(params.city);
  if (!city) return {};
  return {
    title: `Gold Rate Today in ${city} - 24K, 22K, 18K Prices`,
    description: `Today's gold rate in ${city}: live 24K, 22K and 18K gold prices per gram and per 10 grams, with a 7-day trend.`,
  };
}

async function getGoldData(city) {
  // Build an absolute URL so this server component can call our own API route.
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/gold?city=${encodeURIComponent(city)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function GoldRateCityPage({ params }) {
  const city = slugToCity(params.city);
  if (!city) return notFound();

  const data = await getGoldData(city);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/gold-rates" className="hover:text-blue-600">
            Gold Rates
          </Link>{' '}
          / {city}
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Gold Rate Today in {city}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {data ? new Date(data.lastUpdated).toLocaleString() : '—'}
        </p>

        {!data ? (
          <p className="text-red-500">Couldn't load gold rates right now. Please try again shortly.</p>
        ) : (
          <>
            {data.source === 'fallback' && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg px-3 py-2 mb-4">
                ⚠ Showing an estimated rate — live data source was unavailable.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: '24 Karat (99.9%)', per10: data.karat24, perGram: data.perGram24, change: data.change24 },
                { label: '22 Karat (91.6%)', per10: data.karat22, perGram: data.perGram22, change: data.change22 },
                { label: '18 Karat (75%)', per10: data.karat18, perGram: data.perGram18, change: null },
              ].map((row) => (
                <div key={row.label} className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-600">{row.label}</p>
                  <p className="text-xl font-bold text-gray-900">₹{row.per10?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per 10g · ₹{row.perGram} /g</p>
                  {row.change !== null && (
                    <p className={`text-xs font-medium mt-1 ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change)}%
                    </p>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">7-Day Trend (24K, per 10g)</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-right px-4 py-2">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trend?.map((row) => (
                    <tr key={row.date} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-600">{row.date}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-800">
                        {row.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400">
              The above gold rates are indicative and do not include GST, TCS and
              other levies. For exact rates, contact your local jeweller.
            </p>
          </>
        )}

        <div className="mt-8">
          <Link href="/gold-calculator" className="text-blue-600 text-sm font-medium hover:underline">
            → Use the Gold Rate Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
