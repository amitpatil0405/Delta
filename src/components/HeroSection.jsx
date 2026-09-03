import React, { useEffect, useState } from 'react';
import { BarChart3, ChevronRight, BookOpen } from 'lucide-react';

export default function HeroSection({ onExplorePortfolio, onExploreStrategies }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[85vh] pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden bg-transparent">

      {/* Hero Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Viewport Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center">

        {/* Animated Brand Badge */}
        <div
          className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-8 transition-all duration-700 ${
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
          className={`mt-6 text-sm sm:text-base text-gray-400/90 leading-relaxed max-w-3xl transition-all duration-700 delay-300 font-normal ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          At DeltaFox, we bridge the gap between structural engineering precision and institutional-grade financial markets. Founded on the core principles of non-directional probability, mathematical risk management, and rigorous capital preservation, we transform complex options trading into a disciplined, systematic science.
        </p>

        {/* Interactive CTA Buttons */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto transition-all duration-700 delay-400 ${
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

      </div>

    </section>
  );
}
