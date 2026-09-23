import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import { ShieldAlert, X } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [activeLegalTab, setActiveLegalTab] = useState(null);

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

      {/* Pre-Footer Final Brand Scene with Enhanced Ambient Glow & Particle Canvas */}
      <div className="py-8 sm:py-10 border-b border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-[#050505] via-[#09090d] to-[#030304]">

        {/* Animated Glowing Background Sphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 space-y-3 sm:space-y-4 relative z-10">

          {/* Enlarged DeltaFox Emblem */}
          <div className="w-60 h-60 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] mx-auto relative group cursor-pointer" onClick={() => handleLinkClick('home')}>
            <img
              src={logoImg}
              alt="DELTAFOX Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(217,119,6,0.6)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight uppercase leading-tight">
            TRADE WITH LOGIC.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 italic font-serif">
              MOVE WITH THE MARKET.
            </span>
          </h2>

          <p className="text-sm text-gray-300 max-w-lg mx-auto font-mono tracking-wide">
            Systematic Options Trading • Market Intelligence • Risk Management
          </p>

        </div>
      </div>

      {/* Main Footer Links & Compliance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Brand Info (Left) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick('home')}>
              <img src={logoImg} alt="DeltaFox" className="h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-sm">
              DeltaFox is a premium market intelligence and options trading platform built around disciplined strategies, data-driven decisions and risk management.
            </p>
          </div>

          {/* Structured Link Columns & Founder Info (Right) */}
          <div className="md:col-span-8 flex flex-wrap sm:flex-nowrap items-start gap-8 sm:gap-10 lg:gap-12 text-xs">

            {/* Quick Links Column */}
            <div className="space-y-3 min-w-[140px]">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px] font-roboto-mono">QUICK LINKS</span>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick('home')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Home</button></li>
                <li><button onClick={() => handleLinkClick('technical-analysis')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Technical Analysis</button></li>
                <li><button onClick={() => handleLinkClick('portfolio')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Trading Portfolio</button></li>
                <li><button onClick={() => handleLinkClick('intelligence')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Holiday calendar</button></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-3 min-w-[110px]">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px] font-roboto-mono">RESOURCES</span>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick('strategies')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Strategies</button></li>
                <li><button onClick={() => handleLinkClick('training')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Training</button></li>
              </ul>
            </div>

            {/* Company / Support Column */}
            <div className="space-y-3 min-w-[130px]">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px] font-roboto-mono">COMPANY / SUPPORT</span>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick('about')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">About DeltaFox</button></li>
                <li><button onClick={() => handleLinkClick('contact')} className="font-roboto-mono text-xs text-gray-400 hover:text-amber-400 transition-colors text-left">Contact</button></li>
              </ul>
            </div>

            {/* Founder Column (Far Right) */}
            <div className="space-y-3 min-w-[180px]">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px] font-roboto-mono">FOUNDER</span>
              <div className="text-gray-300 text-xs space-y-1 font-roboto-mono">
                <span className="block font-bold text-white">Mr. Amit Patil</span>
                <span className="block text-[11px] text-gray-400">Derivatives trader & quantitative strategist</span>
                <div className="text-[11px] text-gray-400 pt-1">
                  <span>Email: </span>
                  <a
                    href="mailto:deltafox.options@yahoo.com"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    deltafox.options@yahoo.com
                  </a>
                </div>
                <div className="text-[11px] text-gray-400">
                  <span>Website: </span>
                  <a
                    href="https://www.deltafox.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    www.deltafox.in
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Regulatory Risk Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
          <div className="flex flex-col items-center justify-center text-center text-gray-500 text-[11px] leading-relaxed font-sans max-w-4xl mx-auto space-y-1.5">
            <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-mono font-bold uppercase tracking-wider text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Disclaimer</span>
            </div>
            <p className="text-gray-400">
              DeltaFox is an educational and informational platform. Options trading involves substantial risk of loss and is not suitable for all investors. Nothing on this website should be considered financial advice or a recommendation to buy or sell any security.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-[11px] font-mono text-gray-500 pt-6 border-t border-white/5 text-center space-y-2.5">
            <div>
              © 2026 DELTAFOX. All rights reserved.
            </div>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <button
                onClick={() => setActiveLegalTab(activeLegalTab === 'privacy' ? null : 'privacy')}
                className={`hover:text-amber-400 transition-colors cursor-pointer ${activeLegalTab === 'privacy' ? 'text-amber-400 font-bold underline' : ''}`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalTab(activeLegalTab === 'terms' ? null : 'terms')}
                className={`hover:text-amber-400 transition-colors cursor-pointer ${activeLegalTab === 'terms' ? 'text-amber-400 font-bold underline' : ''}`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveLegalTab(activeLegalTab === 'risk' ? null : 'risk')}
                className={`hover:text-amber-400 transition-colors cursor-pointer ${activeLegalTab === 'risk' ? 'text-amber-400 font-bold underline' : ''}`}
              >
                Risk Disclosure
              </button>
            </div>
          </div>

          {/* Interactive Legal Policy Content Viewport */}
          {activeLegalTab && (
            <div className="mt-6 bg-[#0a0a0c]/85 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-xs font-sans text-gray-300 leading-relaxed relative shadow-2xl animate-fadeIn">
              <button
                onClick={() => setActiveLegalTab(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              {activeLegalTab === 'privacy' && (
                <div className="space-y-4 max-w-4xl mx-auto text-left">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                    <span>DELTAFOX PRIVACY POLICY</span>
                  </div>
                  <p className="text-gray-300">
                    At DeltaFox (www.deltafox.in), we prioritize visitor privacy and the security of user communication. This Privacy Policy details the types of information collected and recorded when accessing our platform.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">1. Information Collection & Use</h4>
                    <p className="text-gray-400">
                      We collect minimal information provided voluntarily through contact or inquiry forms (e.g., Name, Email Address, Subject, and Message). This information is exclusively used to respond to user inquiries, verify training program eligibility, and provide service support.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">2. Log Files & Analytics</h4>
                    <p className="text-gray-400">
                      DeltaFox uses standard log files and non-personally identifiable analytical tools to analyze trends, administer the site, track user interaction, and gather demographic insights for platform optimization.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">3. Data Protection & Sharing</h4>
                    <p className="text-gray-400">
                      DeltaFox does not sell, trade, or rent personal identification information to third parties. All communication channels are protected using encrypted protocols.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'terms' && (
                <div className="space-y-4 max-w-4xl mx-auto text-left">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                    <span>DELTAFOX TERMS OF SERVICE</span>
                  </div>
                  <p className="text-gray-300">
                    By accessing or using DeltaFox (www.deltafox.in), you agree to comply with and be bound by the following Terms of Service. If you do not agree with any part of these terms, please do not use the website.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">1. Informational & Educational Purpose</h4>
                    <p className="text-gray-400">
                      All content, market data, options chain analyses, strategy payoff curves, and training resources presented on DeltaFox are strictly for educational and informational purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">2. Training Enrollment & Eligibility</h4>
                    <p className="text-gray-400">
                      Enrollment in DeltaFox training programs is subject to strict eligibility criteria, risk disclosures, and agreement to platform terms. We reserve the right to accept or decline applicants based on program requirements.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">3. Intellectual Property</h4>
                    <p className="text-gray-400">
                      All trademarks, visual designs, 3D assets, custom charting interfaces, and logos are the intellectual property of DeltaFox and Mr. Amit Patil. Unauthorized duplication or redistribution is strictly prohibited.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'risk' && (
                <div className="space-y-4 max-w-4xl mx-auto text-left">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                    <span>DELTAFOX RISK DISCLOSURE & REGULATORY STATEMENT</span>
                  </div>
                  <p className="text-gray-300">
                    Trading in financial derivatives, options, and stock market securities involves substantial risk of capital loss and is not suitable for every investor.
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">1. Risk of Derivatives & Options Trading</h4>
                    <p className="text-gray-400">
                      Options and futures trading carry high leverage risk. The loss incurred in options selling or speculative strategies can equal or exceed the total capital deployed. Past performance records shown on trading journals do not guarantee future results.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">2. No Guaranteed Returns or SEBI Advisory Claims</h4>
                    <p className="text-gray-400">
                      DeltaFox makes no claims of guaranteed returns, assured profits, or SEBI-registered investment advisory services. Users must consult a licensed independent financial advisor before executing any market transactions.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-mono font-bold">3. Information Disclaimer</h4>
                    <p className="text-gray-400">
                      Information and analytical content presented on DeltaFox are provided for educational purposes. DeltaFox assumes no liability for trading decisions made based on website information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </footer>
  );
}
