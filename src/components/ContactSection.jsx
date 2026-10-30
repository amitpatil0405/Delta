import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Play, Sparkles } from 'lucide-react';
import { SOCIAL_CONFIG } from '../services/socialMediaService';
import youtubeLogo from '../assets/youtube_logo.png';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'deltafox.options@yahoo.com';

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  return (
    <section id="contact" className="pt-8 sm:pt-10 pb-16 scroll-mt-16 sm:scroll-mt-20 bg-transparent bg-subpage-grid relative overflow-hidden">
      {/* Ambient Radial Glow Lighting */}
      <div className="ambient-glow-amber top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Mail className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            CONTACT DELTAFOX
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans">
            Connect with us regarding training programs, options trading strategies, or platform inquiries.
          </p>
        </div>

        {/* Form Container with Pulsing Neon Aura Layer (Centered Compact Layout) */}
        <div className="relative rounded-3xl max-w-3xl mx-auto w-full">
          {/* Dedicated Pulsing Neon Background Aura Layer */}
          <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 shadow-[0_0_50px_rgba(255,102,0,0.6),0_0_100px_rgba(255,102,0,0.3)] animate-pulse pointer-events-none" />

          {/* Borderless Glassmorphism Container */}
          <div className="relative bg-[#0a0a0c]/95 rounded-3xl p-6 sm:p-10 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden space-y-8 font-mono">

            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Mail className="w-4 h-4" />
                    <span>DIRECT EMAIL ADDRESS</span>
                  </div>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="text-lg sm:text-xl font-bold text-white hover:text-amber-400 transition-colors break-all block"
                  >
                    {emailAddress}
                  </a>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all uppercase tracking-wider"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY EMAIL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${emailAddress}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-300 text-xs font-bold hover:text-white hover:border-amber-500/50 transition-all uppercase tracking-wider"
                  >
                    <span>SEND EMAIL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Educational & Trading Inquiries Note */}
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  For training programs, systematic options trading inquiries, or general platform support, feel free to drop us a direct email.
                </p>
              </div>
            </div>

            {/* YouTube Channel Integration Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-900/95 to-rose-950/20 border border-white/10 hover:border-rose-500/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                  <img src={youtubeLogo} alt="YouTube" className="w-5 h-5 object-contain shrink-0" />
                  <span>OFFICIAL MEDIA HUB</span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>WATCH HOW WE TRADE</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Join Our YouTube Channel
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                  Explore live trade execution, position sizing frameworks, and systematic options strategies in action.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 shrink-0 fill-current" />
                  <span>VISIT YOUTUBE CHANNEL</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
