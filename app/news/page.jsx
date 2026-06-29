'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Gold News', 'Stock Market', 'Personal Finance', 'Currency'];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFlag, setSourceFlag] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const url = activeCategory === 'All' ? '/api/news' : `/api/news?category=${encodeURIComponent(activeCategory)}`;
        const res = await fetch(url);
        const data = await res.json();
        setNews(data.items || []);
        setSourceFlag(data.source);
      } catch (e) {
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial News</h1>
        <p className="text-gray-500 text-sm mb-6">
          Latest headlines from Moneycontrol, Economic Times and Business Standard.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {sourceFlag === 'fallback' && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-lg px-3 py-2 mb-4">
            ⚠ Live news feeds are temporarily unavailable.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : news.length === 0 ? (
          <p className="text-gray-400 text-sm">No articles in this category right now.</p>
        ) : (
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.slug} className="bg-white rounded-xl shadow p-4">
                <Link
                  href={`/news/${item.slug}`}
                  className="text-base font-semibold text-gray-800 hover:text-blue-700"
                >
                  {item.title}
                </Link>
                {item.snippet && (
                  <p className="text-sm text-gray-500 mt-1">{item.snippet}...</p>
                )}
                <div className="flex gap-3 text-xs text-gray-400 mt-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
                  <span>🏷️ {item.source}</span>
                  {item.time && <span>🕒 {item.time}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-gray-400 mt-8">
          Headlines and snippets are sourced from each publisher's public feed. Click
          through to read the full article on the original site.
        </p>
      </div>
    </main>
  );
}
