import React, { useState, useEffect } from 'react';
import { MarketProvider } from './context/MarketContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DeltaFox3DScene from './components/DeltaFox3DScene';
import MarketOverviewSection from './components/MarketOverviewSection';
import TechnicalAnalysisSection from './components/TechnicalAnalysisSection';
import PortfolioJournalSection from './components/PortfolioJournalSection';
import OptionsStrategiesSection from './components/OptionsStrategiesSection';
import TrainingSection from './components/TrainingSection';
import BlueprintSection from './components/BlueprintSection';
import AboutFounderSection from './components/AboutFounderSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (id) => {
    setActivePage(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MarketProvider>
      <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative">

        {/* Persistent 3D Metallic DeltaFox Background across entire website */}
        <DeltaFox3DScene />

        {/* Transparent Glass Navigation */}
        <Navbar activePage={activePage} onNavigate={handleNavigate} />

        {/* Main Content Sections with relative z-10 stacking */}
        <main className="flex-1 relative z-10">
          {/* 1. Hero Viewport */}
          <HeroSection
            onExplorePortfolio={() => handleNavigate('portfolio')}
            onExploreStrategies={() => handleNavigate('strategies')}
          />

          {/* 2. Technical Analysis Page (Synced from Google Sheet) */}
          <TechnicalAnalysisSection />

          {/* 3. Portfolio & Trading Journal */}
          <PortfolioJournalSection />

          {/* 4. Holiday Calendar (Market Overview & Scheduled Closures) */}
          <MarketOverviewSection />

          {/* 5. 3D Scroll-Driven Options Strategies & Payoff Diagrams */}
          <OptionsStrategiesSection />

          {/* 6. Training & Options Education */}
          <TrainingSection />

          {/* 7. The DeltaFox Blueprint: Trader Mindset & Market Cycles */}
          <BlueprintSection />

          {/* 8. About DeltaFox & Founder Amit Patil */}
          <AboutFounderSection />

          {/* 9. Contact Section */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </MarketProvider>
  );
}
