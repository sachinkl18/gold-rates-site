'use client';
import GoldRates from './components/GoldRates';
import StockMarket from './components/StockMarket';
import CurrencyRates from './components/CurrencyRates';
import NewsFeed from './components/NewsFeed';
import SilverPrice from './components/SilverPrice';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800">💰 India Finance Hub</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Live Gold · Silver · Stocks · Currency · News
          </p>
        </div>

        {/* Row 1: Gold + Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <GoldRates />
          </div>
          <div>
            <CurrencyRates />
          </div>
        </div>

        {/* Row 2: SILVER (Full Width) */}
        <SilverPrice />

        {/* Row 3: Stocks + Big News */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <StockMarket />
          </div>
          <div>
            <NewsFeed />
          </div>
        </div>

      </div>
    </main>
  );
}
