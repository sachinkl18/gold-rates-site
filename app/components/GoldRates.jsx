'use client';
import { useState, useEffect } from 'react';

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

export default function GoldRates() {
  const [city, setCity] = useState('Bangalore');
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
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [city]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🏆 Gold Rates</h2>
        <select 
          value={city} 
          onChange={e => setCity(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
        >
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data?.error ? (
        <div className="text-red-500 text-center py-4">{data.error}</div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-600">24K Gold (per 10g)</p>
            <p className="text-2xl font-bold text-gray-900">₹{data.karat24?.toLocaleString()}</p>
            <p className={`text-sm font-medium ${data.change24 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.change24 >= 0 ? '▲' : '▼'} {Math.abs(data.change24)}%
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
            <p className="text-sm text-gray-600">22K Gold (per 10g)</p>
            <p className="text-2xl font-bold text-gray-900">₹{data.karat22?.toLocaleString()}</p>
            <p className={`text-sm font-medium ${data.change22 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.change22 >= 0 ? '▲' : '▼'} {Math.abs(data.change22)}%
            </p>
          </div>
        </div>
      ) : null}
      <p className="text-xs text-gray-400 text-right mt-4">
        Updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : '--'}
      </p>
    </div>
  );
}
