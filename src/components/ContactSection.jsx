import React, { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';

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
          <div className="relative bg-[#0a0a0c]/95 rounded-3xl p-6 sm:p-12 border-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden text-center flex flex-col items-center space-y-6 font-mono">

            {/* 1. Large/Bold Email Address (Centered) */}
            <a
              href={`mailto:${emailAddress}`}
              className="text-sm min-[360px]:text-base min-[410px]:text-lg sm:text-3xl md:text-4xl font-extrabold text-white hover:text-amber-400 transition-colors whitespace-nowrap block tracking-tight sm:tracking-wide max-w-full"
            >
              {emailAddress}
            </a>

            {/* 2. "COPY EMAIL" Button (Centered directly below email address) */}
            <div>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all uppercase tracking-wider"
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
            </div>

            {/* 3. Brief Inquiry Note */}
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-xl mx-auto pt-1">
              For training programs, systematic options trading inquiries or general platform support, feel free to drop us a direct email.
            </p>

            {/* Subtle Divider */}
            <div className="w-full max-w-lg border-t border-white/10 my-2" />

            {/* 4. Additional Professional Theory / Note */}
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-2xl mx-auto">
              At DeltaFox, we believe in complete transparency and a data-driven, systematic approach to financial markets. Whether you are looking to master non-directional options strategies or have questions regarding our trading psycology, strategies and market intelligence, our team is always ready to assist you.
            </p>

            {/* 5. Final Navigation Reference */}
            <p className="text-xs sm:text-sm text-amber-400/90 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
              Visit the DeltaFox Options page to check out and subscribe our official YouTube channel for live trade executions, position-sizing frameworks and systematic options strategies.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
