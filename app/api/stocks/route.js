import { NextResponse } from 'next/server';

// Top 10 NSE stocks with mock base prices
const BASE_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance', price: 2856.40 },
  { symbol: 'TCS', name: 'Tata Consultancy', price: 4126.80 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1689.50 },
  { symbol: 'INFY', name: 'Infosys', price: 1851.20 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1124.30 },
  { symbol: 'SBIN', name: 'SBI', price: 824.60 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1432.75 },
  { symbol: 'ITC', name: 'ITC', price: 428.90 },
  { symbol: 'WIPRO', name: 'Wipro', price: 692.15 },
  { symbol: 'HCLTECH', name: 'HCL Tech', price: 1827.40 },
];

export async function GET() {
  // Simulate live market movement (+/- 0.5% random change)
  const stocks = BASE_STOCKS.map(s => {
    const changePercent = (Math.random() - 0.5) * 1.2;
    const newPrice = s.price * (1 + changePercent / 100);
    return {
      ...s,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(changePercent.toFixed(2))
    };
  });
  return NextResponse.json(stocks);
}
