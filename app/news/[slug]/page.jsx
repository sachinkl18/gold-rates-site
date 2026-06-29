import Link from 'next/link';
import { notFound } from 'next/navigation';

async function findArticle(slug) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/news`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.items || []).find((item) => item.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const article = await findArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.snippet || article.title,
  };
}

export default async function ArticlePage({ params }) {
  const article = await findArticle(params.slug);
  if (!article) return notFound();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/news" className="hover:text-blue-600">
            News
          </Link>{' '}
          / {article.category}
        </nav>

        <div className="bg-white rounded-xl shadow p-6">
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">
            {article.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{article.title}</h1>
          <div className="flex gap-3 text-xs text-gray-400 mb-4">
            <span>🏷️ {article.source}</span>
            {article.time && <span>🕒 {article.time}</span>}
          </div>

          {article.snippet && (
            <p className="text-gray-600 mb-6">{article.snippet}...</p>
          )}

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Read full article on {article.source} →
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          We link out to the original publisher rather than reproducing full
          articles, to respect each source's content.
        </p>
      </div>
    </main>
  );
}
