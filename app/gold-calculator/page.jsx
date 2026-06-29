'use client';
import { useState, useEffect } from 'react';
import { CITIES } from '../../lib/cities';

const PURITY_PRESETS = [
  { label: '24K (99.9%)', value: 0.999 },
  { label: '22K (91.6%)', value: 0.916 },
  { label: '18K (75%)', value: 0.75 },
  { label: 'Custom', value: 'custom' },
];

const UNITS = [
  { label: 'Grams', toGrams: (v) => v },
  { label: 'Tola', toGrams: (v) => v * 11.6638 },
  { label: 'Ounce', toGrams: (v) => v * 31.1035 },
];

export default function GoldCalculatorPage() {
  const [city, setCity] = useState('Bangalore');
  const [weight, setWeight] = useState(10);
  const [unitIndex, setUnitIndex] = useState(0);
  const [purity, setPurity] = useState(0.916);
  const [customPurity, setCustomPurity] = useState(91.6);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gold?city=${city}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [city]);

  const effectivePurity = purity === 'custom' ? customPurity / 100 : purity;
  const grams = UNITS[unitIndex].toGrams(parseFloat(weight) || 0);

  // data.karat24 is price per 10g at 99.9% purity, so derive a per-gram 24K rate
  const perGram24 = data ? data.karat24 / 10 : 0;
  const baseValue = perGram24 * grams * effectivePurity;
  const makingChargesRate = 0.08; // 8% placeholder, real making charges vary by jeweller/design
  const makingCharges = baseValue * makingChargesRate;
  const subtotal = baseValue + makingCharges;
  const gst = subtotal * 0.03;
  const total = subtotal + gst;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gold Rate Calculator</h1>
        <p className="text-gray-500 text-sm mb-6">
          Estimate the value of your gold based on today's rate, weight and purity.
        </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Unit</label>
              <select
                value={unitIndex}
                onChange={(e) => setUnitIndex(parseInt(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              >
                {UNITS.map((u, i) => (
                  <option key={u.label} value={i}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Purity</label>
            <div className="flex flex-wrap gap-2">
              {PURITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPurity(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    purity === p.value
                      ? 'bg-yellow-400 border-yellow-500 text-gray-900 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {purity === 'custom' && (
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={customPurity}
                onChange={(e) => setCustomPurity(e.target.value)}
                placeholder="Purity %"
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estimated Value</h2>

          {loading || !data ? (
            <p className="text-gray-400 text-sm">Loading current gold rate...</p>
          ) : (
            <div className="space-y-2 text-sm">
              <Row label={`Gold value (${grams.toFixed(2)} g @ ${(effectivePurity * 100).toFixed(1)}%)`} value={baseValue} />
              <Row label="Making charges (8%, indicative)" value={makingCharges} />
              <div className="border-t border-gray-100 my-2" />
              <Row label="Subtotal" value={subtotal} />
              <Row label="GST (3%)" value={gst} />
              <div className="border-t border-gray-200 my-2" />
              <Row label="Total Estimated Value" value={total} bold />
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            This is an indicative estimate only. Making charges vary significantly by
            jeweller and design — confirm exact pricing before any purchase.
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-semibold text-gray-800' : 'text-gray-600'}>{label}</span>
      <span className={bold ? 'font-bold text-gray-900' : 'text-gray-700'}>
        ₹{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}
