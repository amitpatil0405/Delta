import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Play } from 'lucide-react';
import { SOCIAL_CONFIG } from '../services/socialMediaService';

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

        {/* Outer Glowing Glassmorphism Container */}
        <div className="relative rounded-3xl max-w-3xl mx-auto w-full">
          {/* Dedicated Pulsing Neon Background Aura Layer */}
          <div className="absolute -inset-1 rounded-3xl bg-amber-500/10 shadow-[0_0_50px_rgba(255,102,0,0.6),0_0_100px_rgba(255,102,0,0.3)] animate-pulse pointer-events-none" />

          {/* Borderless Glassmorphism Container Content */}
          <div className="relative bg-[#0a0a0c]/95 rounded-3xl p-6 sm:p-12 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden text-center flex flex-col items-center space-y-8 font-mono">

            {/* Direct Email Block */}
            <div className="flex flex-col items-center space-y-4 w-full max-w-xl mx-auto">

              {/* Copy Email Button Positioned Above Email */}
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>

              {/* Center-aligned Email Address */}
              <a
                href={`mailto:${emailAddress}`}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white hover:text-amber-400 transition-colors break-all block tracking-wide"
              >
                {emailAddress}
              </a>

              {/* Note Beneath Email Address */}
              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed pt-1">
                For training programs, systematic options trading inquiries, or general platform support, feel free to drop us a direct email.
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="w-full max-w-lg border-t border-white/10" />

            {/* YouTube Callout Block */}
            <div className="flex flex-col items-center space-y-5 w-full max-w-xl mx-auto">
              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                Visit the DeltaFox Options page and subscribe to our official YouTube channel to see firsthand how we execute systematic options strategies, manage position sizing, and navigate live market volatility.
              </p>

              {/* CTA Link/Button pointing to YouTube */}
              <a
                href={SOCIAL_CONFIG.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] uppercase tracking-wider"
              >
                <Play className="w-4 h-4 shrink-0 fill-current" />
                <span>VISIT YOUTUBE CHANNEL</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
