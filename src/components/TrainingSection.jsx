import React, { useState } from 'react';
import { BookOpen, GraduationCap, Award, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Layers, Play, FileText } from 'lucide-react';

export default function TrainingSection() {
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      id: 'm1',
      title: '01. Systematic Options Foundations',
      subtitle: 'Core principles of options contracts, intrinsic vs time value, and probability-based trading.',
      level: 'FOUNDATION',
      duration: '4 Hours',
      lessons: [
        'Understanding Option Mechanics: Calls, Puts & Moneyness',
        'Implied Volatility (IV) & Volatility Rank (IVR)',
        'Option Pricing Models & Decay (Theta Drivers)',
        'Probability of Profit (POP) vs Expected Value'
      ],
      description: 'Master the foundational mathematics of options pricing to trade with statistical edge rather than market guesswork.'
    },
    {
      id: 'm2',
      title: '02. Advanced Option Greeks & Volatility Surface',
      subtitle: 'In-depth analysis of Delta, Gamma, Theta, Vega, and Rho in portfolio hedging.',
      level: 'INTERMEDIATE',
      duration: '6 Hours',
      lessons: [
        'Delta Neutrality & Gamma Risk Management',
        'Theta Decay Curves & Optimal Expiry Cycles',
        'Vega Skew & Trading Volatility Crush on Earnings',
        'Dynamic Delta Adjustments for Open Positions'
      ],
      description: 'Learn how to read volatility skew and construct Greek-balanced portfolios that generate income across all market regimes.'
    },
    {
      id: 'm3',
      title: '03. High-Probability Income Strategies',
      subtitle: 'Execution and adjustment protocols for Short Strangles, Iron Condors, and Spreads.',
      level: 'ADVANCED',
      duration: '8 Hours',
      lessons: [
        'Short Strangle Mechanics & Margin Optimization',
        'Defined-Risk Iron Condor Setup & Strike Selection',
        'Bull Put & Bear Call Credit Spread Frameworks',
        'Defensive Adjustments: Rolling, Inverting & Hedging'
      ],
      description: 'Step-by-step blueprints for non-directional and directional options strategies with institutional risk-reward parameters.'
    },
    {
      id: 'm4',
      title: '04. Institutional Risk & Portfolio Growth Roadmap',
      subtitle: 'Disciplined capital allocation, drawdown control, and scaling trading capital.',
      level: 'INSTITUTIONAL',
      duration: '5 Hours',
      lessons: [
        'Position Sizing & Maximum Risk per Trade Protocols',
        'Managing Portfolio Drawdowns & Stress Testing',
        'Constructing a Daily Market Prep & Execution Journal',
        'Compounding Rules & Capital Scaling Roadmap'
      ],
      description: 'Develop the institutional discipline and risk management framework required to build and preserve long-term trading wealth.'
    }
  ];

  return (
    <section id="training" className="relative py-24 bg-[#050505] border-t border-white/5 overflow-hidden">

      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>DeltaFox Academy & Portfolio Growth</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            OPTIONS TRADING INTELLIGENCE & TRAINING
          </h2>
          <p className="mt-4 text-base text-gray-400 font-medium">
            Structured educational modules and institutional risk frameworks designed to guide traders in building, managing, and compounding sustainable portfolios.
          </p>
        </div>

        {/* Module Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Module List Column */}
          <div className="lg:col-span-5 space-y-4">
            {modules.map((mod, index) => {
              const active = selectedModule === index;
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(index)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border ${
                    active
                      ? 'bg-neutral-900/90 border-amber-500/50 shadow-[0_0_25px_rgba(217,119,6,0.15)]'
                      : 'bg-neutral-950/60 border-white/5 hover:border-white/20 hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                      active ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-gray-400'
                    }`}>
                      {mod.level}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{mod.duration}</span>
                  </div>
                  <h3 className={`text-lg font-bold font-mono transition-colors ${
                    active ? 'text-amber-400' : 'text-white'
                  }`}>
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {mod.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Module Detail & Curriculum Display */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/30 bg-neutral-950/80 backdrop-blur-md h-full flex flex-col justify-between">

              <div>
                <div className="flex items-center space-x-3 text-xs font-mono text-amber-400 mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>CURRICULUM BREAKDOWN</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white font-mono mb-3">
                  {modules[selectedModule].title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {modules[selectedModule].description}
                </p>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
                    Key Learning Objectives & Lessons:
                  </h4>
                  <div className="space-y-3">
                    {modules[selectedModule].lessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-sm text-gray-200">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action & Resource Card */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Systematic Portfolio Discipline Included</span>
                </div>

                <button
                  onClick={() => alert("Enrollment / Access link: Detailed training material is available for active DeltaFox platform members.")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] flex items-center justify-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ACCESS MODULE</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Portfolio Growth Blueprint Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Probability Edge</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Trade strategies with built-in 70%+ win rates, capturing theta decay and volatility overpricing systematically.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Controlled Capital Allocation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enforce strict position sizing rules (1-3% max risk per trade) to prevent drawdown catastrophic losses.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-neutral-900/50">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-mono mb-2">Compounding Growth</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Standardized trade entry and exit playbooks that allow consistent compounding of trading profits over financial cycles.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
