'use client';
import { useState, useEffect } from 'react';

const CURRENCY_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  AED: 'UAE Dirham', SAR: 'Saudi Riyal', AUD: 'Australian Dollar', CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan', HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar', ZAR: 'South African Rand', THB: 'Thai Baht',
  MYR: 'Malaysian Ringgit', KWD: 'Kuwaiti Dinar', QAR: 'Qatari Riyal',
};

export default function CurrencyConverterPage() {
  const [rates, setRates] = useState(null);
  const [source, setSource] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency');
        const json = await res.json();
        setRates(json.rates);
        setSource(json.source);
      } catch (e) {
        setRates(null);
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const allCurrencies = ['INR', ...Object.keys(CURRENCY_NAMES)];

  // rates are "1 INR = X currency". Convert via INR as the pivot.
  function convert(amt, from, to) {
    if (!rates) return null;
    if (from === to) return amt;
    const inrAmount = from === 'INR' ? amt : amt / rates[from];
    return to === 'INR' ? inrAmount : inrAmount * rates[to];
  }

  const result = convert(parseFloat(amount) || 0, fromCurrency, toCurrency);

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Currency Converter</h1>
        <p className="text-gray-500 text-sm mb-6">
          Convert between INR and 18 major world currencies.
        </p>

        {source === 'fallback' && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg px-3 py-2 mb-4">
            ⚠ Showing estimated rates — live data source was unavailable.
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              >
                {allCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="mb-1 px-2 py-2 text-gray-500 hover:text-blue-600"
              title="Swap currencies"
              aria-label="Swap currencies"
            >
              ⇄
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              >
                {allCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {!rates ? (
              <p className="text-gray-400 text-sm">Loading rates...</p>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {result?.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                <span className="text-base text-gray-500">{toCurrency}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Currency Reference</h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">Code</th>
                  <th className="text-left px-4 py-2">Currency</th>
                  <th className="text-right px-4 py-2">1 INR =</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
                  <tr key={code} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-700">{code}</td>
                    <td className="px-4 py-2 text-gray-600">{name}</td>
                    <td className="px-4 py-2 text-right text-gray-800">
                      {rates ? rates[code]?.toFixed(4) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
