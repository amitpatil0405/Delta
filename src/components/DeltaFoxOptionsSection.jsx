import React from 'react';
import { ExternalLink, Sparkles, QrCode } from 'lucide-react';
import deltafoxOptionsLogo from '../assets/deltafox_options_logo.png';
import instaQrImg from '../assets/insta_qr_cropped.png';
import { SOCIAL_CONFIG } from '../services/socialMediaService';

// Custom inline SVG icons for social platforms
const YoutubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function DeltaFoxOptionsSection() {
  return (
    <section
      id="deltafox-options"
      className="relative min-h-screen pt-8 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto scroll-mt-16 sm:scroll-mt-20 selection:bg-amber-500/30 flex flex-col justify-center"
    >
      {/* Background ambient glow effects */}
      <div className="ambient-glow-amber top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Main Outer Container with Pulsing Neon Aura Layer */}
      <div className="relative rounded-3xl max-w-[1400px] mx-auto w-full">

        {/* Dedicated Pulsing Neon Background Aura Layer (Matching Contact Us Style) */}
        <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 shadow-[0_0_50px_rgba(255,102,0,0.6),0_0_100px_rgba(255,102,0,0.3)] animate-pulse pointer-events-none" />

        {/* Borderless Dark Glassmorphic Card */}
        <div className="relative bg-[#0a0a0c]/95 rounded-3xl p-6 sm:p-8 lg:p-10 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

          {/* Top Centered Badge */}
          <div className="flex justify-center pb-6 sm:pb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL MEDIA & OPTIONS HUB</span>
            </div>
          </div>

          {/* 2-Column Responsive Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

            {/* Left Column — Centered Brand Header & 2x2 Content Focus Grid */}
            <div className="lg:col-span-6 flex flex-col items-center text-center space-y-5">

              {/* Centered Sub-Brand Emblem Logo */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-500/30 rounded-2xl blur-lg group-hover:opacity-100 transition duration-500 opacity-70" />
                <img
                  src={deltafoxOptionsLogo}
                  alt="DeltaFox Options"
                  className="relative h-24 sm:h-28 w-auto object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] mx-auto"
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
                DeltaFox Options is the official media and educational extension of DeltaFox. We deliver quantitative options trading concepts, strategic frameworks, volatility insights, and live trade analytics through our official YouTube and Instagram platforms.
              </p>

              {/* What We Cover On Our Channels — 2x2 Grid */}
              <div className="w-full pt-2">
                <div className="text-amber-400 font-mono text-[11px] uppercase tracking-widest font-bold mb-3 text-center flex items-center justify-center space-x-2">
                  <span className="h-px w-8 bg-amber-500/30" />
                  <span>WHAT WE COVER ON OUR CHANNELS</span>
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

            {/* Right Column — Vertically Balanced Social Media Cards */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">

              {/* YouTube Card */}
              <div className="bg-neutral-900/80 border border-red-500/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg group hover:border-red-500/60 transition-all duration-300">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-600" />

                <div className="flex items-center space-x-4">
                  <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] flex-shrink-0">
                    <YoutubeIcon className="w-8 h-8" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <h2 className="text-lg font-bold text-white font-mono">DeltaFox Trading</h2>
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono border border-red-500/30 uppercase">
                        YouTube Official
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {SOCIAL_CONFIG.youtube.handle}
                    </p>
                  </div>
                </div>

                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_30px_rgba(220,38,38,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>SUBSCRIBE & WATCH OUR VIDEOS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Instagram Card & Integrated Dark QR Code */}
              <div className="bg-neutral-900/80 border border-amber-500/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-amber-500/60 transition-all duration-300">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500" />

                {/* Instagram Text & CTA */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3.5">
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] flex-shrink-0">
                      <InstagramIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white font-mono">
                        {SOCIAL_CONFIG.instagram.handle}
                      </h2>
                      <p className="text-[11px] text-pink-400 font-mono">
                        Official Instagram Page
                      </p>
                    </div>
                  </div>

                  <a
                    href={SOCIAL_CONFIG.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.35)] hover:shadow-[0_0_30px_rgba(219,39,119,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>FOLLOW ON INSTAGRAM</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Scanned QR Code Card */}
                <div className="bg-black/90 border border-amber-500/40 rounded-xl p-3.5 text-center space-y-2 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] flex-shrink-0 w-44 sm:w-48 group-hover:border-amber-400 transition-colors">
                  <div className="inline-flex items-center justify-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono uppercase tracking-wider">
                    <QrCode className="w-3 h-3" />
                    <span>SCAN TO FOLLOW</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30">
                    <img
                      src={instaQrImg}
                      alt="Instagram @DELTAFOX_OPTIONS QR Code"
                      className="w-full h-auto object-contain rounded"
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono">
                    {SOCIAL_CONFIG.instagram.handle}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
