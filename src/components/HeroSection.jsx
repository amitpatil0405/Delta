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

        {/* Animated Brand Badge in Premium Golden/Amber Theme */}
        <div
          className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4 sm:mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Systematic Options Trading & Portfolio Intelligence</span>
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
          className={`mt-6 text-base sm:text-xl text-gray-400 font-medium tracking-wide max-w-3xl transition-all duration-700 delay-200 ${
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
          className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto transition-all duration-700 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={onExplorePortfolio}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(217,119,6,0.4)] flex items-center justify-center space-x-3 group active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span>VIEW TRADING PORTFOLIO</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreStrategies}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-gray-200 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center space-x-3 group active:scale-95"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>OUR STRATEGIES</span>
          </button>
        </div>

        {/* Quick Access Navigation Chips */}
        <div
          className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 transition-all duration-700 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => onNavigate && onNavigate('technical-analysis')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-amber-500/20 hover:border-amber-400/60 text-xs font-mono text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center space-x-1.5 group backdrop-blur-md"
          >
            <LineChart className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Technical Analysis</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('intelligence')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-amber-500/20 hover:border-amber-400/60 text-xs font-mono text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center space-x-1.5 group backdrop-blur-md"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Holiday Calendar</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('training')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-amber-500/20 hover:border-amber-400/60 text-xs font-mono text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center space-x-1.5 group backdrop-blur-md"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Training Program</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('blueprint')}
            className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0c]/80 border border-amber-500/20 hover:border-amber-400/60 text-xs font-mono text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center space-x-1.5 group backdrop-blur-md"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Trader Blueprint</span>
          </button>
        </div>

        {/* Institutional Pillars Feature Cards */}
        <div
          className={`mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl text-left transition-all duration-700 delay-600 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Card 1: Quantitative Execution */}
          <div className="bg-[#0c0c0e]/90 border border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-16 h-16 text-amber-400" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mb-2 flex items-center space-x-2">
              <span>Quantitative Execution</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Rules-based non-directional options models driven by volatility surfaces and statistical probability edge.
            </p>
          </div>

          {/* Card 2: Capital Preservation */}
          <div className="bg-[#0c0c0e]/90 border border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-16 h-16 text-emerald-400" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mb-2 flex items-center space-x-2">
              <span>Capital Preservation</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Strict position sizing and loss thresholds designed to safeguard principal during volatile market regimes.
            </p>
          </div>

          {/* Card 3: Live Verified Journal */}
          <div className="bg-[#0c0c0e]/90 border border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <LineChart className="w-16 h-16 text-sky-400" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LineChart className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mb-2 flex items-center space-x-2">
              <span>Live Verified Journal</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Transparent trade logging synced directly with live database records, cumulative P&L curves, and analytics.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
