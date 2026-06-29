'use client';
import { useState, useEffect } from 'react';

const CURRENCY_NAMES = { USD: 'USD', EUR: 'EUR', GBP: 'GBP', JPY: 'JPY', AED: 'AED', SAR: 'SAR' };

export default function CurrencyRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency');
        const data = await res.json();
        setRates(data);
      } catch (e) { /* ignore */ }
      setLoading(false);
    };
    fetchRates();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💱 Exchange Rates</h2>
      <p className="text-xs text-gray-400 mb-3">1 INR =</p>
      {loading ? (
        <div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : rates ? (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(rates.rates).map(([code, rate]) => (
            <div key={code} className="bg-gray-50 rounded-lg p-3 text-center border">
              <p className="text-xs text-gray-500 font-medium">{CURRENCY_NAMES[code] || code}</p>
              <p className="font-semibold text-gray-800">{rate.toFixed(4)}</p>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400 text-center">No data</p>}
    </div>
  );
}
