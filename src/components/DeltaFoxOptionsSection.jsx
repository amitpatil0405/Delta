import React from 'react';
import { ExternalLink, Sparkles, Play } from 'lucide-react';
import deltafoxOptionsLogo from '../assets/deltafox_options_logo.png';
import youtubeLogo from '../assets/youtube_logo.png';
import { SOCIAL_CONFIG } from '../services/socialMediaService';

export default function DeltaFoxOptionsSection() {
  return (
    <section
      id="deltafox-options"
      className="relative min-h-[85vh] sm:min-h-screen pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto scroll-mt-12 sm:scroll-mt-16 selection:bg-amber-500/30 flex flex-col justify-center -mt-4 sm:-mt-6"
    >
      {/* Background ambient glow effects */}
      <div className="ambient-glow-amber top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Main Outer Container with Pulsing Neon Aura Layer */}
      <div className="relative rounded-3xl max-w-[1400px] mx-auto w-full">

        {/* Dedicated Pulsing Neon Background Aura Layer (Matching Contact Us Style) */}
        <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 shadow-[0_0_50px_rgba(255,102,0,0.6),0_0_100px_rgba(255,102,0,0.3)] animate-pulse pointer-events-none" />

        {/* Borderless Dark Glassmorphic Card (Frosted Glass with backdrop-blur) */}
        <div className="relative bg-[#0a0a0c]/70 backdrop-blur-md rounded-3xl p-5 sm:p-7 lg:p-9 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

          {/* Subtle bottom accent bar (Symmetrical) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

          {/* Top Centered Badge */}
          <div className="flex justify-center pb-4 sm:pb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL MEDIA & OPTIONS HUB</span>
            </div>
          </div>

          {/* 2-Column Responsive Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Column — Centered Brand Header & 2x2 Content Focus Grid */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 my-auto">

              {/* Centered Sub-Brand Emblem Logo */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-500/30 rounded-2xl blur-lg group-hover:opacity-100 transition duration-500 opacity-70" />
                <img
                  src={deltafoxOptionsLogo}
                  alt="DeltaFox Options"
                  className="relative h-28 sm:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] mx-auto"
                />
              </div>

              {/* Centered Header Text */}
              <div className="space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono uppercase">
                  DELTAFOX OPTIONS
                </h1>
                <p className="text-amber-400 font-mono text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  OFFICIAL MEDIA & OPTIONS HUB OF DELTAFOX
                </p>
              </div>

              {/* Centered Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg text-center font-sans">
                DeltaFox Options is the official media and educational extension of DeltaFox. We deliver quantitative options trading concepts, strategic frameworks, volatility insights, and live trade analytics through our official YouTube platform.
              </p>

              {/* What We Cover On Our Channel — 2x2 Grid */}
              <div className="w-full pt-1">
                <div className="text-amber-400 font-mono text-[11px] uppercase tracking-widest font-bold mb-3 text-center flex items-center justify-center space-x-2">
                  <span className="h-px w-8 bg-amber-500/30" />
                  <span>WHAT WE COVER ON OUR CHANNEL</span>
                  <span className="h-px w-8 bg-amber-500/30" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left font-sans">

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-1">
                    <div className="flex items-center space-x-2 text-white font-mono text-xs font-bold">
                      <span className="text-base">🎯</span>
                      <span>Live Trade Execution & Rationale</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Why we entered specific options trades (Short Strangles, Spreads) and technical chart logic.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-1">
                    <div className="flex items-center space-x-2 text-white font-mono text-xs font-bold">
                      <span className="text-base">📊</span>
                      <span>Position Sizing & Quantity Rules</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Risk management frameworks, lot sizing, and margin deployment strategies.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-1">
                    <div className="flex items-center space-x-2 text-white font-mono text-xs font-bold">
                      <span className="text-base">🔄</span>
                      <span>Real-Time Trade Status & Adjustments</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Active position tracking, P&L updates, adjustment mechanics, and exit strategies.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-1">
                    <div className="flex items-center space-x-2 text-white font-mono text-xs font-bold">
                      <span className="text-base">📈</span>
                      <span>Options Analytics & Volatility</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      OI buildup, Implied Volatility (IV) crush, and delta/gamma risk commentary.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column — YouTube Card Exclusively */}
            <div className="lg:col-span-6 flex flex-col justify-center items-center my-auto w-full">

              {/* YouTube Card — Directly Displayed Prominent Custom Logo */}
              <div className="w-full max-w-lg bg-neutral-900/80 border rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-lg flex flex-col items-center text-center space-y-6 group animate-youtube-card-border transition-all duration-300">

                {/* Section Tag */}
                <div className="flex justify-center">
                  <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20 text-center">
                    OFFICIAL YOUTUBE CHANNEL
                  </span>
                </div>

                {/* Centered Header Block: Prominent Custom YouTube Logo Image directly without box container */}
                <div className="flex flex-col items-center space-y-3 pt-1">
                  <img
                    src={youtubeLogo}
                    alt="YouTube Logo"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                  />

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono">DeltaFox Options</h2>
                    <p className="text-sm sm:text-base text-gray-300 font-sans font-medium tracking-wide">
                      {SOCIAL_CONFIG.youtube.handle}
                    </p>
                  </div>
                </div>

                {/* Description under handle matching reference */}
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-md text-center">
                  Watch live systematic trade executions, non-directional options strategy breakdowns, position-sizing models, and volatility analyses.
                </p>

                {/* Centered CTA Button with Standard Lucide Play Icon */}
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-md inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_30px_rgba(220,38,38,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  <Play className="w-4 h-4 text-white fill-current shrink-0" />
                  <span>SUBSCRIBE & WATCH OUR VIDEOS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white shrink-0" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
