'use client';
import { useState, useEffect } from 'react';

export default function LiveTicker() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ticker');
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData(null);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const items = data
    ? [
        { label: 'Sensex', value: data.sensex, change: data.sensexChange },
        { label: 'Nifty', value: data.nifty, change: data.niftyChange },
        { label: '22K Gold/gm', value: `₹${data.gold22PerGram}`, change: data.goldChange },
        { label: 'Silver/kg', value: `₹${data.silverPerKg}`, change: data.silverChange },
        { label: 'Petrol', value: `₹${data.petrol}`, change: null },
        { label: 'Diesel', value: `₹${data.diesel}`, change: null },
        { label: 'LPG', value: `₹${data.lpg}`, change: null },
        { label: 'Crude Oil', value: `$${data.crudeOil}`, change: null },
        { label: 'USD/INR', value: `₹${data.usdInr}`, change: null },
      ]
    : [];

  return (
    <div className="bg-blue-900 text-white text-xs md:text-sm overflow-x-auto whitespace-nowrap py-2 px-4">
      {!data ? (
        <span className="opacity-70">Loading live rates...</span>
      ) : (
        <div className="inline-flex gap-6">
          {items.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              <span className="opacity-80">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
              {item.change !== null && item.change !== undefined && (
                <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
