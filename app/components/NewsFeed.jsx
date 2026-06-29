'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data.items || []);
      } catch (e) { /* ignore */ }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between border-b-4 border-blue-600 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📰 Top Headlines</h2>
        <Link href="/news" className="text-sm text-blue-600 hover:underline">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <ul className="space-y-4">
          {news.slice(0, 7).map((item, index) => (
            <li key={item.slug || index} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                  {index + 1}
                </span>
                <div>
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-sm font-semibold text-gray-800 hover:text-blue-700 cursor-pointer"
                  >
                    {item.title}
                  </Link>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>🏷️ {item.source}</span>
                    <span>🕒 {item.time}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
