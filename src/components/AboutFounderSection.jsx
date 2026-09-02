import React from 'react';
import { ShieldCheck, Target, Terminal, Compass, Award, Cpu } from 'lucide-react';
import myPic from '../assets/my_pic.jpg';

export default function AboutFounderSection() {
  return (
    <section id="about" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">

      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* About DeltaFox Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Institutional Identity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ABOUT DELTAFOX
          </h2>
          <p className="text-xl font-mono text-amber-400 font-semibold">
            Where Data Meets Discipline.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-sans max-w-2xl mx-auto pt-2">
            DeltaFox was built with a singular vision: to bring institutional-grade discipline, systematic risk management, and mathematical clarity to options trading. We believe consistent wealth generation in the markets is not a result of emotional gambling or guesswork, but of structured frameworks, volatility awareness, and rigorous capital preservation.
          </p>
        </div>

        {/* Founder Presentation */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/30 relative overflow-hidden bg-gradient-to-br from-neutral-950 via-[#0a0a0c] to-black">

          <div className="text-center mb-10">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
              MEET THE FOUNDER
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

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
                  Founder & Private Fund Manager
                </p>
              </div>
            </div>

            {/* Founder Story & Bio */}
            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                <Cpu className="w-3.5 h-3.5" />
                <span>IT Engineer & Systematic Derivatives Trader</span>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                Blending a strong technical foundation as an IT Engineer with deep expertise in financial markets, Amit Patil leads DeltaFox with a logic-driven, systematic approach. His engineering background brings structural precision, automation thinking, and rigorous risk control into quantitative trading.
              </p>

              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                Specializing in advanced options trading strategies—particularly non-directional frameworks, credit spreads, and volatility-based execution—he focuses on building and scaling portfolios where data and math take precedence over emotion. His core philosophy revolves around capital preservation, strict rule execution, and navigating changing market regimes with absolute composure.
              </p>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block uppercase">CAPITAL PRESERVATION</span>
                    <span className="text-gray-400 text-[11px] font-sans">Strict position sizing rules and strict drawdown management.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block uppercase">SYSTEMATIC EXECUTION</span>
                    <span className="text-gray-400 text-[11px] font-sans">Mathematical probabilities and non-directional volatility edges.</span>
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
