import React, { useEffect, useState } from 'react';
import { BarChart3, ChevronRight, BookOpen, ShieldCheck, Cpu, LineChart, GraduationCap, Calendar, Compass } from 'lucide-react';

export default function HeroSection({ onExplorePortfolio, onExploreStrategies, onNavigate }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-0 sm:min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 flex flex-col justify-start sm:justify-center items-center overflow-hidden bg-transparent">

      {/* Hero Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none transform-gpu" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      {/* Main Viewport Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center">

        {/* Metallic Golden Glassmorphic Tagline Banner */}
        <div
          className={`relative overflow-hidden inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 backdrop-blur-xl border border-amber-500/50 text-xs sm:text-sm font-mono tracking-widest uppercase mb-4 sm:mb-6 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-700 group ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Shimmer Sweep Beam Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-amber-300/30 to-transparent pointer-events-none" />
          <span className="relative z-10 font-black tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
            DELTAFOX: PROBABILITY OVER PREDICTION
          </span>
        </div>

        {/* Main Brand Title & Headings */}
        <h1
          className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl leading-[1.1] transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Where Risk Meets Reward,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 font-serif italic">
            Intelligently.
          </span>
        </h1>

        <p
          className={`mt-6 text-base sm:text-xl text-amber-400/90 font-mono font-medium tracking-wide max-w-3xl transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Systematic Options Trading • Portfolio Journal • Risk Management
        </p>

        <p
          className={`mt-4 sm:mt-6 text-sm sm:text-base text-gray-400/90 leading-relaxed text-justify sm:text-center max-w-3xl transition-all duration-700 delay-300 font-normal ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          At DeltaFox, founded in September 2025, we use precise math and smart strategies to trade in financial markets. We focus on protecting capital, managing risk carefully and transforming complex options trading into a simple, disciplined science. Our approach combines data-driven insights, statistical analysis and structured risk management. Every trade is backed by a clear statistical edge and strict risk controls with a focus on long-term stability and consistent growth.
        </p>

        {/* Interactive CTA Buttons */}
        <div
          className={`mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto transition-all duration-700 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={onExplorePortfolio}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_rgba(217,119,6,0.4)] flex items-center justify-center space-x-2.5 group active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span>VIEW TRADING PORTFOLIO</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreStrategies}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-200 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center space-x-2.5 group active:scale-95"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>OUR STRATEGIES</span>
          </button>
        </div>

        {/* Institutional Pillars Feature Cards (Glassmorphism Version) */}
        <div
          className={`mt-6 sm:mt-7 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-5xl text-left transition-all duration-700 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Card 1: Quantitative Execution */}
          <div className="bg-[#0a0a0c]/65 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/70 rounded-xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-10 h-10 text-amber-400" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide mb-1 flex items-center space-x-2">
              <span>Quantitative Execution</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-300/90 leading-relaxed">
              Rules-based non-directional options models driven by volatility surfaces and statistical probability edge.
            </p>
          </div>

          {/* Card 2: Capital Preservation */}
          <div className="bg-[#0a0a0c]/65 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/70 rounded-xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide mb-1 flex items-center space-x-2">
              <span>Capital Preservation</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-300/90 leading-relaxed">
              Strict position sizing and loss thresholds designed to safeguard principal during volatile market regimes.
            </p>
          </div>

          {/* Card 3: Live Verified Journal */}
          <div className="bg-[#0a0a0c]/65 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/70 rounded-xl p-3.5 sm:p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <LineChart className="w-10 h-10 text-sky-400" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <LineChart className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide mb-1 flex items-center space-x-2">
              <span>Live Verified Journal</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-300/90 leading-relaxed">
              Transparent trade logging synced directly with live database records, cumulative P&L curves, and analytics.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
