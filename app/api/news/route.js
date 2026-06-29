import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

// Public RSS feeds for Indian finance / markets news.
// We only ever surface title + source + short snippet + outbound link —
// never the full article body — to respect each source's copyright.
const FEEDS = [
  { url: 'https://www.moneycontrol.com/rss/marketreports.xml', source: 'Moneycontrol', category: 'Stock Market' },
  { url: 'https://www.moneycontrol.com/rss/MCtopnews.xml', source: 'Moneycontrol', category: 'Personal Finance' },
  { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', source: 'Economic Times', category: 'Stock Market' },
  { url: 'https://www.business-standard.com/rss/markets-106.rss', source: 'Business Standard', category: 'Stock Market' },
];

const parser = new XMLParser({ ignoreAttributes: false });

let cache = { data: null, timestamp: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function categorize(title, fallback) {
  const t = title.toLowerCase();
  if (t.includes('gold') || t.includes('silver')) return 'Gold News';
  if (t.includes('rupee') || t.includes('dollar') || t.includes('currency') || t.includes('forex')) return 'Currency';
  if (t.includes('sensex') || t.includes('nifty') || t.includes('share') || t.includes('stock') || t.includes('ipo')) return 'Stock Market';
  return fallback;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndiaFinanceHub/1.0)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item || [];
    const arr = Array.isArray(items) ? items : [items];

    return arr.slice(0, 10).map((item) => {
      const title = typeof item.title === 'string' ? item.title : item.title?.['#text'] || '';
      const link = typeof item.link === 'string' ? item.link : item.link?.['#text'] || '';
      const pubDate = item.pubDate || null;
      const rawDescription =
        typeof item.description === 'string' ? item.description : item.description?.['#text'] || '';
      // Strip any HTML tags and cap to a short snippet only.
      const snippet = rawDescription
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 140);

      return {
        title,
        link,
        snippet,
        source: feed.source,
        category: categorize(title, feed.category),
        pubDate,
        slug: slugify(title),
      };
    });
  } catch (error) {
    console.error(`Feed fetch failed for ${feed.source}:`, error.message);
    return [];
  }
}

function timeAgo(pubDate) {
  if (!pubDate) return '';
  const diffMs = Date.now() - new Date(pubDate).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const now = Date.now();
  let allItems;

  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    allItems = cache.data;
  } else {
    const results = await Promise.all(FEEDS.map(fetchFeed));
    const merged = results.flat();

    // Dedupe by title (case-insensitive)
    const seen = new Set();
    allItems = merged.filter((item) => {
      const key = item.title.toLowerCase();
      if (!item.title || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort newest first where we have a date
    allItems.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });

    if (allItems.length > 0) {
      cache = { data: allItems, timestamp: now };
    }
  }

  // Fallback if every feed failed and there's no cache to fall back on
  if (!allItems || allItems.length === 0) {
    return NextResponse.json({
      items: [
        {
          title: 'Live news feed temporarily unavailable',
          link: '#',
          snippet: 'We could not reach our news sources right now. Please check back shortly.',
          source: 'System',
          category: 'Stock Market',
          pubDate: null,
          slug: 'feed-unavailable',
        },
      ],
      source: 'fallback',
    });
  }

  const filtered = category ? allItems.filter((i) => i.category === category) : allItems;
  const withTimeAgo = filtered.map((i) => ({ ...i, time: timeAgo(i.pubDate) }));

  return NextResponse.json({ items: withTimeAgo, source: 'live' });
}
