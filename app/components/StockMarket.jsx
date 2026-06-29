'use client';
import { useState, useEffect } from 'react';

export default function StockMarket() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch('/api/stocks');
        const data = await res.json();
        setStocks(data);
      } catch (e) { /* ignore */ }
      setLoading(false);
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Top NSE Stocks</h2>
      {loading ? (
        <div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Symbol</th>
                <th className="py-2">Price (₹)</th>
                <th className="py-2 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 font-medium text-gray-800">{s.symbol}</td>
                  <td className="py-2">{s.price.toFixed(2)}</td>
                  <td className={`py-2 text-right font-medium ${s.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
