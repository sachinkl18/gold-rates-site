'use client';
import { useState, useEffect } from 'react';

export default function SilverPrice() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSilver = async () => {
      try {
        const res = await fetch('/api/silver');
        const json = await res.json();
        if (json.success) setData(json);
      } catch (e) {}
      setLoading(false);
    };
    fetchSilver();
    const interval = setInterval(fetchSilver, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="bg-white p-4 rounded-xl shadow-md mt-4 text-gray-500">Loading silver...</div>;
  if (!data) return <div className="bg-white p-4 rounded-xl shadow-md mt-4 text-red-500">Silver unavailable</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">🥈 Silver Price (XAG)</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Per Gram</p>
          <p className="font-bold">₹{data.rates.inr.perGram}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500">Per KG</p>
          <p className="font-bold">₹{data.rates.inr.perKg}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center border-2 border-blue-200">
          <p className="text-xs text-gray-500 font-bold">50 KG</p>
          <p className="font-bold text-blue-700 text-xl">₹{data.rates.inr.per50Kg}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">
        Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}
