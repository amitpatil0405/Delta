import React from 'react';
import { ExternalLink, Sparkles, Play } from 'lucide-react';
import deltafoxOptionsLogo from '../assets/deltafox_options_logo.png';
import { SOCIAL_CONFIG } from '../services/socialMediaService';

export default function DeltaFoxOptionsSection() {
  return (
    <section
      id="deltafox-options"
      className="relative pt-3 sm:pt-4 lg:pt-4 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto scroll-mt-16 sm:scroll-mt-20 selection:bg-amber-500/30 overflow-hidden bg-transparent bg-subpage-grid min-[1400px]:min-h-[calc(100vh-5rem)] min-[1400px]:flex min-[1400px]:flex-col min-[1400px]:justify-center"
    >
      {/* Main Outer Container */}
      <div className="relative rounded-3xl max-w-[1400px] mx-auto w-full mt-1 lg:mt-[4px]">

        {/* Dark Glassmorphic Card with Slim Glowing Orange Border */}
        <div className="relative bg-[#0a0a0c]/85 backdrop-blur-md rounded-3xl p-5 sm:p-7 lg:p-8 xl:p-9 border border-amber-500/60 animate-orange-border-glow overflow-hidden">

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
                  Official Media & Options Hub of DeltaFox
                </p>
              </div>

              {/* Centered Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg text-center font-sans">
                DeltaFox Options is the official media and educational extension of DeltaFox. We deliver quantitative options trading concepts, strategic frameworks, volatility insights, and live trade analytics through our official YouTube platform.
              </p>

              {/* What We Cover On Our Channels — 2x2 Grid */}
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

            {/* Right Column — Vertically Centered Expanded YouTube Showcase Box */}
            <div className="lg:col-span-6 flex flex-col justify-center my-auto h-full">

              {/* YouTube Card — Expanded & Centered to Seamlessly Fill Right Box */}
              <div className="bg-neutral-900/80 border rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center space-y-6 group animate-youtube-card-border transition-all duration-300 w-full h-full min-h-[380px]">

                {/* Section Tag */}
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                  <span>OFFICIAL YOUTUBE CHANNEL</span>
                </div>

                {/* Centered Professional Vector YouTube Icon */}
                <div className="relative group/logo">
                  <div className="absolute -inset-4 bg-red-600/25 rounded-3xl blur-2xl group-hover/logo:opacity-100 transition duration-500 opacity-60 pointer-events-none" />
                  <svg
                    viewBox="0 0 288 202"
                    className="relative w-24 sm:w-28 h-auto object-contain drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
                    aria-label="YouTube"
                  >
                    <path
                      d="M281.4 31.6C278.1 19.3 268.4 9.6 256.1 6.3 233.8 0 144 0 144 0S54.2 0 31.9 6.3C19.6 9.6 9.9 19.3 6.6 31.6 0 54 0 101 0 101s0 47 6.6 69.4c3.3 12.3 13 22 25.3 25.3 22.3 6.3 112.1 6.3 112.1 6.3s89.8 0 112.1-6.3c12.3-3.3 22-13 25.3-25.3 6.6-22.4 6.6-69.4 6.6-69.4s0-47-6.6-69.4z"
                      fill="#FF0000"
                    />
                    <polygon
                      points="115.2,143.9 190.1,101 115.2,58.1"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>

                {/* Channel Title and Handle */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                    DeltaFox Options
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 font-sans font-medium tracking-wide">
                    {SOCIAL_CONFIG.youtube.handle}
                  </p>
                </div>

                {/* Highlight Description */}
                <p className="text-xs sm:text-sm text-gray-400 max-w-md font-sans leading-relaxed">
                  Watch live systematic trade executions, non-directional options strategy breakdowns, position-sizing models, and volatility analyses.
                </p>

                {/* Centered CTA Action Button */}
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:shadow-[0_0_35px_rgba(220,38,38,0.6)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
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
