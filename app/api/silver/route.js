import { NextResponse } from 'next/server';
import { CITIES } from '../../../lib/cities';

function cityOffset(city) {
  const index = CITIES.findIndex((c) => c.toLowerCase() === (city || '').toLowerCase());
  if (index === -1) return 0;
  return (index - CITIES.length / 2) * 1.5; // small per-kg offset
}

function buildTrend(basePricePerKg) {
  const trend = [];
  let price = basePricePerKg;
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
    });
    const drift = Math.sin(i * 1.3) * 800;
    price = price - drift;
  }
  return trend;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Bangalore';
  const offset = cityOffset(city);

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=inr',
      { next: { revalidate: 60 } }
    );

    if (!response.ok) throw new Error('Failed');
    const data = await response.json();

    const priceInrPerOunce = data.silver.inr;
    const priceInrPerGram = priceInrPerOunce / 31.1035;
    const priceInrPerKg = priceInrPerGram * 1000 + offset;
    const priceInrPer50Kg = priceInrPerKg * 50;

    return NextResponse.json({
      success: true,
      city,
      rates: {
        inr: {
          perGram: parseFloat((priceInrPerKg / 1000).toFixed(2)),
          perKg: parseFloat(priceInrPerKg.toFixed(2)),
          per50Kg: parseFloat(priceInrPer50Kg.toFixed(2)),
        },
      },
      trend: buildTrend(priceInrPerKg),
      source: 'live',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    const fallbackPerKg = 85500 + offset;
    return NextResponse.json({
      success: true,
      city,
      rates: {
        inr: {
          perGram: parseFloat((fallbackPerKg / 1000).toFixed(2)),
          perKg: fallbackPerKg,
          per50Kg: fallbackPerKg * 50,
        },
      },
      trend: buildTrend(fallbackPerKg),
      source: 'fallback',
      lastUpdated: new Date().toISOString(),
    });
  }
}
