import React from 'react';
import { ExternalLink, Sparkles, Play, Camera } from 'lucide-react';
import deltafoxOptionsLogo from '../assets/deltafox_options_logo.png';
import instaQrImg from '../assets/insta_qr_cropped.png';
import youtubeLogo from '../assets/youtube_logo.png';
import instaLogo from '../assets/insta_logo.png';
import { SOCIAL_CONFIG } from '../services/socialMediaService';

export default function DeltaFoxOptionsSection() {
  return (
    <section
      id="deltafox-options"
      className="relative pt-3 sm:pt-4 lg:pt-4 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto scroll-mt-16 sm:scroll-mt-20 selection:bg-amber-500/30 overflow-hidden bg-transparent bg-subpage-grid border-t border-white/5"
    >
      {/* Background ambient glow effects nicely positioned in top gap */}
      <div className="ambient-glow-amber top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 md:opacity-90" />

      {/* Main Outer Container with Pulsing Neon Aura Layer */}
      <div className="relative rounded-3xl max-w-[1400px] mx-auto w-full mt-1 lg:mt-[4px]">

        {/* Dedicated Pulsing Neon Background Aura Layer (Matching Contact Us Style) */}
        <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 shadow-[0_0_50px_rgba(255,102,0,0.6),0_0_100px_rgba(255,102,0,0.3)] animate-pulse pointer-events-none" />

        {/* Borderless Dark Glassmorphic Card (Frosted Glass with backdrop-blur) */}
        <div className="relative bg-[#0a0a0c]/70 backdrop-blur-md rounded-3xl p-5 sm:p-7 lg:p-8 xl:p-9 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">

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

              {/* YouTube Card — Directly Displayed Prominent Custom Logo */}
              <div className="bg-neutral-900/80 border rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg flex flex-col items-center text-center space-y-4 group animate-youtube-card-border transition-all duration-300">

                {/* Responsive Section Tag: Center on Mobile (< md), Top-Left on Desktop (md+) */}
                <div className="w-full flex justify-center md:justify-start">
                  <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 text-center md:text-left">
                    OFFICIAL YOUTUBE CHANNEL
                  </span>
                </div>

                {/* Centered Header Block: Prominent Custom YouTube Logo Image directly without box container */}
                <div className="flex flex-col items-center space-y-2 pt-1">
                  <img
                    src={youtubeLogo}
                    alt="YouTube Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.45)]"
                  />

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">DeltaFox Options</h2>
                    <p className="text-sm sm:text-base text-gray-300 font-sans font-medium tracking-wide mt-1">
                      {SOCIAL_CONFIG.youtube.handle}
                    </p>
                  </div>
                </div>

                {/* Centered CTA Button with Standard Lucide Play Icon */}
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_30px_rgba(220,38,38,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  <Play className="w-4 h-4 text-white fill-current shrink-0" />
                  <span>SUBSCRIBE & WATCH OUR VIDEOS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white shrink-0" />
                </a>
              </div>

              {/* Instagram Card — Matching Symmetrical Layout Structure */}
              <div className="bg-neutral-900/80 border rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg flex flex-col justify-between space-y-4 group animate-instagram-card-border transition-all duration-300">

                {/* Responsive Section Tag: Center on Mobile (< md), Top-Left on Desktop (md+) */}
                <div className="w-full flex justify-center md:justify-start">
                  <span className="text-[10px] font-mono font-bold text-pink-400 tracking-wider uppercase bg-pink-500/10 px-2.5 py-1 rounded-md border border-pink-500/20 text-center md:text-left">
                    OFFICIAL INSTAGRAM PAGE
                  </span>
                </div>

                {/* Main Content Row: Left Vertical Block (Logo, Handle, Equalized CTA Button) & Right Scanner Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">

                  {/* Left Area: Vertically Rearranged Instagram Block (Top Logo, Middle Handle, Bottom Equalized CTA Button) */}
                  <div className="flex flex-col items-center justify-center text-center space-y-4 flex-1 w-full my-auto">

                    {/* Header Block: Top Custom Instagram Logo & Middle Handle Name */}
                    <div className="flex flex-col items-center space-y-2 pt-1">
                      <img
                        src={instaLogo}
                        alt="Instagram Logo"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_20px_rgba(236,72,153,0.45)] shrink-0"
                      />

                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">DeltaFox Options</h2>
                        <p className="text-sm sm:text-base text-gray-300 font-sans font-medium tracking-wide mt-1">
                          {SOCIAL_CONFIG.instagram.handle}
                        </p>
                      </div>
                    </div>

                    {/* Bottom: CTA Button with Equalized Height/Width/Padding matching YouTube Button */}
                    <a
                      href={SOCIAL_CONFIG.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-sm inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.35)] hover:shadow-[0_0_30px_rgba(219,39,119,0.55)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                      <Camera className="w-4 h-4 text-white shrink-0" />
                      <span>FOLLOW ON INSTAGRAM</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white shrink-0" />
                    </a>
                  </div>

                  {/* Right Area: Styled QR Code Scanner Card with Standard Lucide Camera Icon Overlay Badge */}
                  <div className="bg-black/90 border border-amber-500/40 rounded-xl p-3 text-center space-y-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] shrink-0 w-36 sm:w-40 group-hover:border-amber-400 transition-colors mx-auto sm:mx-0 my-auto">
                    <div className="inline-flex items-center justify-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[8.5px] font-mono uppercase tracking-wider">
                      <Camera className="w-2.5 h-2.5 text-amber-400" />
                      <span>SCAN TO FOLLOW</span>
                    </div>

                    <div className="bg-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30">
                      <img
                        src={instaQrImg}
                        alt="Instagram @DeltaFox_Options QR Code"
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
