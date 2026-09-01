import React from 'react';
import { ShieldCheck, Award, Target, Terminal, Compass, Zap } from 'lucide-react';
import myPic from '../assets/my_pic.jpg';
import logoImg from '../assets/logo.png';

export default function AboutFounderSection() {
  return (
    <section id="about" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">

      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* About DeltaFox Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Compass className="w-4 h-4" />
            <span>Institutional Identity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ABOUT DELTAFOX
          </h2>
          <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
            DeltaFox is built around systematic options trading, market intelligence, quantitative analytics, and disciplined risk management.
          </p>
        </div>

        {/* 3D Brand Moment & Founder Presentation */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/30 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Founder Photo Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_35px_rgba(217,119,6,0.25)] group mb-4">
              <img
                src={myPic}
                alt="Amit Patil - Founder of DeltaFox"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-extrabold text-white font-mono tracking-wide">
                AMIT PATIL
              </h3>
              <p className="text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                Founder & Lead derivative strategies
              </p>
            </div>
          </div>

          {/* Founder Story & Vision */}
          <div className="lg:col-span-7 space-y-6">

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>Quantitative & Risk Frameworks</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono leading-tight">
              An options trader focused on systematic strategies, market analysis, and disciplined risk management.
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              DeltaFox was established to eliminate subjective market guesswork and replace emotion with mathematical probabilities, data-driven options structures, and systematic risk management.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">DISCIPLINED CAPITAL</span>
                  <span className="text-gray-400 text-[11px] font-sans">Strict position sizing and predefined risk parameters for every trade.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">MARKET INTELLIGENCE</span>
                  <span className="text-gray-400 text-[11px] font-sans">Real-time options skew, Open Interest concentration, and PCR analysis.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
