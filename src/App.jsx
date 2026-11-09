import React, { useState, useEffect } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DeltaFox3DScene from './components/DeltaFox3DScene';
import MarketOverviewSection from './components/MarketOverviewSection';
import TechnicalAnalysisSection from './components/TechnicalAnalysisSection';
import PortfolioJournalSection from './components/PortfolioJournalSection';
import DeltaFoxOptionsSection from './components/DeltaFoxOptionsSection';
import OptionsStrategiesSection from './components/OptionsStrategiesSection';
import TrainingSection from './components/TrainingSection';
import BlueprintSection from './components/BlueprintSection';
import AboutFounderSection from './components/AboutFounderSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const { portfolioEnabled, deltafoxOptionsEnabled } = useMarket();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  // Guard active page if portfolio is disabled
  useEffect(() => {
    if (!portfolioEnabled && activePage === 'portfolio') {
      setActivePage('home');
    }
  }, [portfolioEnabled, activePage]);

  // Guard active page if DeltaFox Options is disabled
  useEffect(() => {
    if (!deltafoxOptionsEnabled && activePage === 'deltafox-options') {
      setActivePage('home');
    }
  }, [deltafoxOptionsEnabled, activePage]);

  const handleNavigate = (id) => {
    // Restrict access to Portfolio page route when disabled
    if (id === 'portfolio' && !portfolioEnabled) {
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Restrict access to DeltaFox Options route when disabled
    if (id === 'deltafox-options' && !deltafoxOptionsEnabled) {
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative">

      {/* Persistent 3D Metallic DeltaFox Background across entire website */}
      <DeltaFox3DScene />

      {/* Transparent Glass Navigation */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content Sections with relative z-10 stacking */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero Viewport */}
        <HeroSection
          portfolioEnabled={portfolioEnabled}
          onExplorePortfolio={() => handleNavigate('portfolio')}
          onExploreStrategies={() => handleNavigate('strategies')}
        />

        {/* 2. Technical Analysis Page (Synced from Google Sheet) */}
        <TechnicalAnalysisSection />

        {/* 3. Portfolio & Trading Journal (Dynamically controlled via Google Sheet R1 cell) */}
        {portfolioEnabled && <PortfolioJournalSection />}

        {/* 4. DeltaFox Options Media Hub & Social Integration (Dynamically controlled via Google Sheet U1 cell) */}
        {deltafoxOptionsEnabled && <DeltaFoxOptionsSection />}

        {/* 5. Holiday Calendar (Market Overview & Scheduled Closures) */}
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
  );
}

export default function App() {
  return (
    <MarketProvider>
      <AppContent />
    </MarketProvider>
  );
}
