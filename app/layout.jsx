import NavBar from './components/NavBar';
import LiveTicker from './components/LiveTicker';
import Footer from './components/Footer';

export const metadata = {
  title: {
    default: 'India Finance Hub - Gold, Silver, Stocks & Currency',
    template: '%s | India Finance Hub',
  },
  description:
    'Live gold rates, silver rates, stock market, currency exchange and financial news for India.',
  openGraph: {
    title: 'India Finance Hub',
    description:
      'Live gold rates, silver rates, stock market, currency exchange and financial news for India.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Finance Hub',
    description:
      'Live gold rates, silver rates, stock market, currency exchange and financial news for India.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <LiveTicker />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
