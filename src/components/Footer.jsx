import React from 'react';
import logoImg from '../assets/logo.png';
import { ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#030304] border-t border-white/10 text-gray-400 font-sans relative overflow-hidden">

      {/* Pre-Footer Final Brand Scene */}
      <div className="py-20 border-b border-white/5 text-center relative">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          <div className="w-24 h-24 mx-auto relative group cursor-pointer" onClick={() => handleLinkClick('home')}>
            <img src={logoImg} alt="DELTAFOX Emblem" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(217,119,6,0.4)] group-hover:scale-110 transition-transform duration-500" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight uppercase">
            TRADE WITH LOGIC. MOVE WITH THE MARKET.
          </h2>

          <p className="text-xs text-gray-400 max-w-lg mx-auto font-mono">
            Systematic Options Trading • Market Intelligence • Risk Management
          </p>

        </div>
      </div>

      {/* Main Footer Links & Compliance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('home')}>
              <img src={logoImg} alt="DeltaFox" className="h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-sm">
              DeltaFox is a premium market intelligence and options trading platform built around disciplined strategies, data-driven decisions and risk management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs">

            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">PLATFORM</span>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick('home')} className="hover:text-amber-400 transition-colors">Home</button></li>
                <li><button onClick={() => handleLinkClick('markets')} className="hover:text-amber-400 transition-colors">Markets</button></li>
                <li><button onClick={() => handleLinkClick('options')} className="hover:text-amber-400 transition-colors">Options Terminal</button></li>
                <li><button onClick={() => handleLinkClick('strategies')} className="hover:text-amber-400 transition-colors">Strategies</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">RESOURCES</span>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick('news')} className="hover:text-amber-400 transition-colors">Live Market News</button></li>
                <li><button onClick={() => handleLinkClick('portfolio')} className="hover:text-amber-400 transition-colors">Trading Journal</button></li>
                <li><button onClick={() => handleLinkClick('about')} className="hover:text-amber-400 transition-colors">About DeltaFox</button></li>
                <li><button onClick={() => handleLinkClick('contact')} className="hover:text-amber-400 transition-colors">Contact</button></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">FOUNDER</span>
              <div className="text-gray-300 font-sans text-xs">
                <span className="block font-bold text-white font-mono">AMIT PATIL</span>
                <span className="text-[11px] text-gray-400">Options Strategist & Quantitative Trader</span>
              </div>
            </div>

          </div>

        </div>

        {/* Regulatory Risk Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-start space-x-3 text-gray-500 text-[11px] leading-relaxed font-sans">
            <ShieldAlert className="w-5 h-5 text-amber-500/80 shrink-0 mt-0.5" />
            <p>
              <strong className="text-gray-400 font-mono">DISCLAIMER:</strong> DeltaFox is an educational and informational platform. Market data and information may be delayed or inaccurate depending on the data provider. Options trading involves substantial risk of loss and is not suitable for all investors. Nothing on this website should be considered financial advice or a recommendation to buy or sell any security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500 pt-4 border-t border-white/5">
            <div>
              © {new Date().getFullYear()} DELTAFOX. All rights reserved.
            </div>
            <div className="mt-2 sm:mt-0 space-x-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Risk Disclosure</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
