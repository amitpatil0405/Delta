import React, { useState, useEffect } from 'react';
import { Menu, X, TrendingUp, Shield, Activity, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useMarket } from '../context/MarketContext';

export default function Navbar({ activePage = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { marketStatus } = useMarket();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'markets', label: 'Markets' },
    { id: 'options', label: 'Options' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'news', label: 'News' },
    { id: 'portfolio', label: 'Portfolio' },
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

          {/* Brand Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 group-hover:border-amber-500/80 transition-all duration-300 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
              <img
                src={logoImg}
                alt="DELTAFOX Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white font-mono flex items-center space-x-1">
                DELTA<span className="text-amber-500">FOX</span>
              </span>
              <span className="text-[9px] text-gray-400 tracking-widest font-mono uppercase">
                Institutional Intel
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-neutral-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  activePage === item.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action & Market Status */}
          <div className="hidden sm:flex items-center space-x-4">

            {/* IST Market Status Indicator */}
            <div className="flex items-center space-x-2 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-gray-300 text-[11px] uppercase font-semibold">
                {marketStatus.status}
              </span>
            </div>

            {/* Terminal CTA */}
            <button
              onClick={() => handleNavClick('options')}
              className="relative inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg hover:from-amber-300 hover:to-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.4)] group active:scale-95"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>MARKET TERMINAL</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
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
          <div className="flex items-center justify-between px-2 py-1 mb-2 bg-neutral-900/80 rounded-lg border border-white/5 text-xs font-mono">
            <span className="text-gray-400">STATUS:</span>
            <span className={`font-bold ${marketStatus.isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {marketStatus.status} ({marketStatus.istTime})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                  activePage === item.id
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
            <span>OPEN MARKET TERMINAL</span>
          </button>
        </div>
      )}
    </nav>
  );
}
