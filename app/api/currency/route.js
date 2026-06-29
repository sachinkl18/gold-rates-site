// app/api/currency/route.js
import { NextResponse } from 'next/server';

// Fallback rates (1 INR to foreign currency)
const FALLBACK_RATES = {
  USD: 0.0120,
  EUR: 0.0111,
  GBP: 0.0095,
  JPY: 1.89,
  AED: 0.0440,
  SAR: 0.0450,
  AUD: 0.0182,
  CAD: 0.0163,
  SGD: 0.0161,
  CHF: 0.0108,
  CNY: 0.0858,
  HKD: 0.0936,
  NZD: 0.0197,
  ZAR: 0.2186,
  THB: 0.4150,
  MYR: 0.0537,
  KWD: 0.00367,
  QAR: 0.0437,
};

const CURRENCY_KEYS = Object.keys(FALLBACK_RATES);

function withVariation() {
  const rates = {};
  for (const [key, val] of Object.entries(FALLBACK_RATES)) {
    const variation = 1 + (Math.random() - 0.5) * 0.04;
    rates[key] = parseFloat((val * variation).toFixed(4));
  }
  return rates;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/inr.json',
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      const rates = data.inr;
      const mappedRates = {};
      for (const key of CURRENCY_KEYS) {
        const lower = key.toLowerCase();
        mappedRates[key] = rates[lower] || FALLBACK_RATES[key];
      }
      return NextResponse.json({
        base: 'INR',
        rates: mappedRates,
        source: 'live',
        lastUpdated: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        base: 'INR',
        rates: withVariation(),
        source: 'fallback',
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (error) {
    return NextResponse.json({
      base: 'INR',
      rates: withVariation(),
      source: 'fallback',
      lastUpdated: new Date().toISOString(),
    });
  }
}
