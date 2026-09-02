import React, { useState } from 'react';
import { MarketProvider } from './context/MarketContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveMarketCards from './components/LiveMarketCards';
import StockWatchlistSection from './components/StockWatchlistSection';
import OptionsChainSection from './components/OptionsChainSection';
import OptionsStrategiesSection from './components/OptionsStrategiesSection';
import MarketNewsSection from './components/MarketNewsSection';
import TrainingSection from './components/TrainingSection';
import BlueprintSection from './components/BlueprintSection';
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
      <div className="relative min-h-screen bg-[#050505] text-gray-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">

        {/* Site-Wide Continuous Ambient Grid & Particle Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-3xl" />

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

          {/* 7. Training & Options Education */}
          <TrainingSection />

          {/* 8. The DeltaFox Blueprint: Trader Mindset & Market Cycles */}
          <BlueprintSection />

          {/* 9. Portfolio & Trading Journal */}
          <PortfolioJournalSection />

          {/* 10. About DeltaFox & Founder Amit Patil */}
          <AboutFounderSection />

          {/* 11. Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </MarketProvider>
  );
}
