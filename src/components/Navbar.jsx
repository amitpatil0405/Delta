import React, { useState, useEffect } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useMarket } from '../context/MarketContext';

export default function Navbar({ activePage = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activePage);
  const { marketStatus } = useMarket();

  useEffect(() => {
    setCurrentSection(activePage);
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    const sectionIds = ['home', 'market-section', 'charts-section', 'watchlist-section', 'options', 'portfolio', 'strategies', 'training', 'about', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'market-section' || id === 'charts-section' || id === 'watchlist-section' || id === 'options') {
            setCurrentSection('market-section');
          } else {
            setCurrentSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'market-section', label: 'Market' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'training', label: 'Training' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dynamic market status indicator (Orange for Pre-open, Green for Open, Red for Closed)
  const getStatusBadge = () => {
    const status = marketStatus?.status || 'MARKET CLOSED';
    if (status.includes('PRE-MARKET')) {
      return {
        dotBg: 'bg-amber-500',
        text: 'PRE-OPEN',
        textColor: 'text-amber-400'
      };
    } else if (status.includes('OPEN') || marketStatus?.isOpen) {
      return {
        dotBg: 'bg-emerald-500',
        text: 'MARKET OPEN',
        textColor: 'text-emerald-400'
      };
    } else {
      return {
        dotBg: 'bg-rose-500',
        text: 'MARKET CLOSED',
        textColor: 'text-rose-400'
      };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Direct Clean Brand Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <img
              src={logoImg}
              alt="DELTAFOX"
              className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_16px_rgba(217,119,6,0.4)]"
            />
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-neutral-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  currentSection === item.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Top Corner: Market Status Indicator & Option Chain Button */}
          <div className="hidden xl:flex items-center space-x-3">
            {/* Dynamic Market Status Indicator with Blinking Circle */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-white/10 text-xs font-mono shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${statusBadge.dotBg}`}></span>
              <span className={`font-bold uppercase ${statusBadge.textColor}`}>{statusBadge.text}</span>
            </div>

            <button
              onClick={() => handleNavClick('options')}
              className="relative inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg hover:from-amber-300 hover:to-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.4)] group active:scale-95"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>INSTITUTIONAL OPTION CHAIN</span>
            </button>
          </div>

          <div className="hidden sm:flex xl:hidden items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-white/10 text-xs font-mono shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${statusBadge.dotBg}`}></span>
              <span className={`font-bold uppercase ${statusBadge.textColor}`}>{statusBadge.text}</span>
            </div>

            <button
              onClick={() => handleNavClick('options')}
              className="relative inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg shadow-[0_0_20px_rgba(217,119,6,0.4)]"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>OPTION CHAIN</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-white/10 text-[10px] font-mono">
              <span className={`w-2 h-2 rounded-full animate-pulse ${statusBadge.dotBg}`}></span>
              <span className={`font-bold ${statusBadge.textColor}`}>{statusBadge.text}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 text-gray-300 hover:text-white border border-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0c] border-b border-white/10 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 px-3 py-2.5 mb-2 bg-neutral-900/80 rounded-lg border border-white/5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-[10px]">MARKET:</span>
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${statusBadge.dotBg}`}></span>
                <span className={`font-bold ${statusBadge.textColor}`}>
                  {statusBadge.text}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                  currentSection === item.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavClick('options')}
            className="w-full mt-3 flex items-center justify-center space-x-2 py-3 text-sm font-bold uppercase text-black bg-amber-500 rounded-lg shadow-lg"
          >
            <Activity className="w-4 h-4" />
            <span>INSTITUTIONAL OPTION CHAIN</span>
          </button>
        </div>
      )}
    </nav>
  );
}
