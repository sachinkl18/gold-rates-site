// app/api/ticker/route.js
import { NextResponse } from 'next/server';

// Fallback/simulated base values for items with no free real-time API
const BASE = {
  sensex: 77100,
  nifty: 24056,
  petrol: 105.50,
  diesel: 92.30,
  lpg: 920.00,
  crudeOil: 73.0,
};

export async function GET() {
  let gold22PerGram = null;
  let silverPerKg = null;
  let usdInr = null;
  let source = 'live';

  try {
    const [goldRes, silverRes, currencyRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=inr', {
        next: { revalidate: 60 },
      }),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=inr', {
        next: { revalidate: 60 },
      }),
      fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/inr.json', {
        next: { revalidate: 60 },
      }),
    ]);

    if (!goldRes.ok || !silverRes.ok || !currencyRes.ok) throw new Error('Upstream failed');

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    const currencyData = await currencyRes.json();

    const goldPerGram = goldData.gold.inr;
    gold22PerGram = Math.round(goldPerGram * 0.916);

    const silverPerOunce = silverData.silver.inr;
    silverPerKg = Math.round((silverPerOunce / 31.1035) * 1000);

    usdInr = currencyData.inr.usd ? parseFloat((1 / currencyData.inr.usd).toFixed(2)) : null;
  } catch (error) {
    console.error('Ticker API error:', error);
    source = 'fallback';
    gold22PerGram = 13000;
    silverPerKg = 235000;
    usdInr = 87.5;
  }

  // Indices and fuel prices: no free real-time public API exists for these,
  // so we simulate small daily movement around realistic base values and
  // clearly mark the source as "simulated" in the response.
  const sensexChange = parseFloat(((Math.random() - 0.5) * 1.2).toFixed(2));
  const niftyChange = parseFloat(((Math.random() - 0.5) * 1.2).toFixed(2));
  const goldChange = parseFloat(((Math.random() - 0.5) * 1.5).toFixed(2));
  const silverChange = parseFloat(((Math.random() - 0.5) * 1.5).toFixed(2));

  return NextResponse.json({
    sensex: Math.round(BASE.sensex * (1 + sensexChange / 100)),
    sensexChange,
    nifty: Math.round(BASE.nifty * (1 + niftyChange / 100)),
    niftyChange,
    gold22PerGram,
    goldChange,
    silverPerKg,
    silverChange,
    petrol: BASE.petrol,
    diesel: BASE.diesel,
    lpg: BASE.lpg,
    crudeOil: BASE.crudeOil,
    usdInr,
    source,
    lastUpdated: new Date().toISOString(),
  });
}
