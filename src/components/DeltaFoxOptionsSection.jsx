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

              {/* Centered Sub-Brand Emblem Logo (Scaled ~15% larger for prominent feel) */}
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
                DeltaFox Options is the official media and educational extension of DeltaFox. We deliver quantitative options trading concepts, strategic frameworks, volatility insights, and live trade analytics through our official YouTube and Instagram platforms.
              </p>

              {/* What We Cover On Our Channels — 2x2 Grid */}
              <div className="w-full pt-1">
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

            {/* Right Column — Vertically Balanced Redesigned Social Media Cards */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5 my-auto">

              {/* YouTube Card — Redesigned Clean Centered Flow with Responsive Section Tag & Slow Animated Gradient Border */}
              <div className="bg-neutral-900/80 border rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg flex flex-col items-center text-center space-y-4 group animate-youtube-card-border transition-all duration-300">

                {/* Responsive Section Tag: Center on Mobile (< md), Top-Left on Desktop (md+) */}
                <div className="w-full flex justify-center md:justify-start">
                  <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 text-center md:text-left">
                    OFFICIAL YOUTUBE CHANNEL
                  </span>
                </div>

                {/* Centered Header Block: YouTube Icon, Channel Title, & Handle */}
                <div className="flex flex-col items-center space-y-2 pt-1">
                  <div className="p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    <YoutubeIcon className="w-9 h-9" />
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">Deltafox Options</h2>
                    <p className="text-sm sm:text-base text-gray-300 font-sans font-medium tracking-wide mt-1">
                      {SOCIAL_CONFIG.youtube.handle}
                    </p>
                  </div>
                </div>

                {/* Centered CTA Button directly beneath channel block */}
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_30px_rgba(220,38,38,0.55)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <YoutubeIcon className="w-4 h-4 text-black" />
                  <span>SUBSCRIBE & WATCH OUR VIDEOS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </a>
              </div>

              {/* Instagram Card — Responsive Tag, Crisp Handle, Vertically Centered QR Code & Slow Animated Gradient Border */}
              <div className="bg-neutral-900/80 border rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg flex flex-col justify-between space-y-4 group animate-instagram-card-border transition-all duration-300">

                {/* Responsive Section Tag: Center on Mobile (< md), Top-Left on Desktop (md+) */}
                <div className="w-full flex justify-center md:justify-start">
                  <span className="text-[10px] font-mono font-bold text-pink-400 tracking-wider uppercase bg-pink-500/10 px-2.5 py-1 rounded-md border border-pink-500/20 text-center md:text-left">
                    OFFICIAL INSTAGRAM PAGE
                  </span>
                </div>

                {/* Main Content Row: Left Block (Handle & Button) & Right QR Code Vertically Centered */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 my-auto">

                  {/* Left Area: Centered Handle Block & CTA Button */}
                  <div className="flex flex-col items-center justify-center text-center space-y-3 flex-1 w-full sm:w-auto my-auto">

                    {/* Handle with Icon & Crisp Font Styling */}
                    <div className="flex items-center justify-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.3)] shrink-0">
                        <InstagramIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-sm sm:text-base font-semibold text-gray-300 font-sans tracking-wide">
                        {SOCIAL_CONFIG.instagram.handle}
                      </h2>
                    </div>

                    {/* CTA Button directly beneath handle */}
                    <a
                      href={SOCIAL_CONFIG.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-xs inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.35)] hover:shadow-[0_0_30px_rgba(219,39,119,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                      <InstagramIcon className="w-4 h-4 text-black" />
                      <span>FOLLOW ON INSTAGRAM</span>
                      <ExternalLink className="w-3.5 h-3.5 text-black" />
                    </a>
                  </div>

                  {/* Right Area: Styled QR Code Card - Perfectly Vertically Centered */}
                  <div className="bg-black/90 border border-amber-500/40 rounded-xl p-3 text-center space-y-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] shrink-0 w-36 sm:w-40 group-hover:border-amber-400 transition-colors mx-auto sm:mx-0 my-auto">
                    <div className="inline-flex items-center justify-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8.5px] font-mono uppercase tracking-wider">
                      <QrCode className="w-2.5 h-2.5" />
                      <span>SCAN TO FOLLOW</span>
                    </div>

                    <div className="bg-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30">
                      <img
                        src={instaQrImg}
                        alt="Instagram @DELTAFOX_OPTIONS QR Code"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>

                    <p className="text-[9px] text-gray-300 font-sans font-medium tracking-wide">
                      {SOCIAL_CONFIG.instagram.handle}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
