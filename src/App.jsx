import React, { useState } from 'react';
import { MarketProvider } from './context/MarketContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveMarketCards from './components/LiveMarketCards';
import StockWatchlistSection from './components/StockWatchlistSection';
import OptionsChainSection from './components/OptionsChainSection';
import OptionsStrategiesSection from './components/OptionsStrategiesSection';
import MarketNewsSection from './components/MarketNewsSection';
import SentimentAndPhilosophySection from './components/SentimentAndPhilosophySection';
import PortfolioJournalSection from './components/PortfolioJournalSection';
import AboutFounderSection from './components/AboutFounderSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const handleNavigate = (id) => {
    setActivePage(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MarketProvider>
      <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">

        {/* Transparent Glass Navigation */}
        <Navbar activePage={activePage} onNavigate={handleNavigate} />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Hero Viewport */}
          <HeroSection
            onExploreMarkets={() => handleNavigate('markets')}
            onExploreStrategies={() => handleNavigate('strategies')}
          />

          {/* 2. Real-Time Market Overview */}
          <LiveMarketCards />

          {/* 3. Interactive Chart & Sector Watchlist */}
          <StockWatchlistSection />

          {/* 4. Options Chain & Terminal */}
          <OptionsChainSection />

          {/* 5. 3D Scroll-Driven Options Strategies & Payoff Diagrams */}
          <OptionsStrategiesSection />

          {/* 6. Market News & Insights */}
          <MarketNewsSection />

          {/* 7. Market Sentiment & DeltaFox Philosophy */}
          <SentimentAndPhilosophySection />

          {/* 8. Portfolio & Trading Journal */}
          <PortfolioJournalSection />

          {/* 9. About DeltaFox & Founder Amit Patil */}
          <AboutFounderSection />

          {/* 10. Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </MarketProvider>
  );
}
