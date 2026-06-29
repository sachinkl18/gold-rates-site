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
    title: `Silver Rate Today in ${city} - Per Gram, Kg & 50kg`,
    description: `Today's silver rate in ${city}: live price per gram, per kg and per 50kg, with a 7-day trend.`,
  };
}

async function getSilverData(city) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/silver?city=${encodeURIComponent(city)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function SilverRateCityPage({ params }) {
  const city = slugToCity(params.city);
  if (!city) return notFound();

  const data = await getSilverData(city);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/silver-rates" className="hover:text-blue-600">
            Silver Rates
          </Link>{' '}
          / {city}
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">Silver Rate Today in {city}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {data ? new Date(data.lastUpdated).toLocaleString() : '—'}
        </p>

        {!data ? (
          <p className="text-red-500">Couldn't load silver rates right now. Please try again shortly.</p>
        ) : (
          <>
            {data.source === 'fallback' && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg px-3 py-2 mb-4">
                ⚠ Showing an estimated rate — live data source was unavailable.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Per Gram', value: data.rates.inr.perGram },
                { label: 'Per Kg', value: data.rates.inr.perKg },
                { label: 'Per 50 Kg', value: data.rates.inr.per50Kg },
              ].map((row) => (
                <div key={row.label} className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-300">
                  <p className="text-sm text-gray-600">{row.label}</p>
                  <p className="text-xl font-bold text-gray-900">₹{row.value?.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">7-Day Trend (per kg)</h2>
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
              The above silver rates are indicative and do not include GST and other
              levies. For exact rates, contact your local dealer.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
