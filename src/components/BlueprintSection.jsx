import React from 'react';
import { Shield, Target, Cpu, Bot, TrendingUp, Activity, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';

export default function BlueprintSection() {
  const mindsetPrinciples = [
    {
      icon: Shield,
      title: 'Capital Preservation First',
      tagline: 'Protect capital before chasing profits',
      description: 'The first rule of options trading is survival. Capital is your inventory—once destroyed, game over. Every trade must have a non-negotiable risk limit.',
      color: 'amber'
    },
    {
      icon: Target,
      title: 'Probability Over Prediction',
      tagline: 'Focus on mathematical probability & theta decay',
      description: 'Stop guessing market directions. Leverage statistical edges, delta probabilities, volatility surface skew, and time decay (theta) to trade like the house.',
      color: 'emerald'
    },
    {
      icon: Cpu,
      title: 'Discipline in Execution',
      tagline: 'Stick strictly to rules, no revenge trading',
      description: 'Trading success is 10% strategy and 90% execution. Follow pre-defined entry, exit, and adjustment protocols without emotional hesitation or impulse trades.',
      color: 'amber'
    },
    {
      icon: Bot,
      title: 'Emotional Detachment',
      tagline: 'Treat trading like a robotic, calculated business',
      description: 'Eliminate hope, greed, and fear. Treat losses as operational expenses and profits as systematic outputs of a well-tested statistical model.',
      color: 'emerald'
    }
  ];

  const volatilityRegimes = [
    {
      vixRange: 'VIX < 14',
      title: 'Low Volatility Regime',
      badge: "Option Writer's Paradise",
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      borderColor: 'border-emerald-500/30',
      strategies: ['Short Strangles', 'Iron Condors', 'Calendar Spreads'],
      description: 'Markets are calm with predictable range-bound price action. Ideal environment for selling out-of-the-money premium with high probability of theta decay.'
    },
    {
      vixRange: 'VIX 14 - 18',
      title: 'Normal Volatility Regime',
      badge: 'Balanced Zone',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      borderColor: 'border-amber-500/30',
      strategies: ['Credit Spreads', 'Trend Following with Hedges', 'Collar Strategies'],
      description: 'Standard market condition. Premium yields are healthy and price swings are controlled. Use defined-risk credit spreads with dynamic delta adjustments.'
    },
    {
      vixRange: 'VIX > 20',
      title: 'High Volatility Regime',
      badge: 'Danger / Opportunity Zone',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      borderColor: 'border-rose-500/30',
      strategies: ['Defined-Risk Spreads Only', 'Long Volatility Hedges', 'Avoid Panic Execution'],
      description: 'Sharp market turbulence and rapid IV spikes. Avoid naked option writing. Stick exclusively to defined-risk spreads and capitalize on volatility crush once VIX peaks.'
    }
  ];

  return (
    <section id="blueprint" className="pt-8 sm:pt-10 pb-24 scroll-mt-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">

      {/* Background Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* Section Main Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Compass className="w-4 h-4" />
            <span>DeltaFox Core Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            THE DELTAFOX BLUEPRINT
          </h2>
          <p className="mt-3 text-lg font-mono text-amber-400">
            TRADER MINDSET & MARKET CYCLES
          </p>
          <p className="mt-3 text-sm text-gray-400 font-medium">
            Systematic framework governing trader psychology, capital risk limits, and adaptive volatility regime strategies.
          </p>
        </div>

        {/* PART 1: TRADER MINDSET & PRINCIPLES */}
        <div className="space-y-8">
          <div className="border-l-2 border-amber-500 pl-4">
            <h3 className="text-2xl font-extrabold text-white font-mono uppercase tracking-wide">
              PART 1 — TRADER MINDSET & PRINCIPLES
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Core psychological rules that separate amateur retail traders from systematic professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mindsetPrinciples.map((item, index) => {
              const IconComp = item.icon;
              const isAmber = item.color === 'amber';

              return (
                <div
                  key={index}
                  className={`glass-card rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
                    isAmber
                      ? 'border-amber-500/30 bg-neutral-950/80 hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(217,119,6,0.12)]'
                      : 'border-emerald-500/30 bg-neutral-950/80 hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 border ${
                        isAmber
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-400">
                          PRINCIPLE 0{index + 1}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold text-white font-mono">
                        {item.title}
                      </h4>

                      <p className={`text-xs font-mono font-semibold ${
                        isAmber ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        "{item.tagline}"
                      </p>

                      <p className="text-xs text-gray-300 leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 2: MARKET CYCLES & VOLATILITY REGIMES */}
        <div className="space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h3 className="text-2xl font-extrabold text-white font-mono uppercase tracking-wide">
              PART 2 — MARKET CYCLES & VOLATILITY REGIMES
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Adapting option structures dynamically to India VIX and implied volatility conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {volatilityRegimes.map((regime, index) => (
              <div
                key={index}
                className={`glass-card rounded-2xl p-7 border bg-neutral-950/90 flex flex-col justify-between ${regime.borderColor} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-white">
                      {regime.vixRange}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${regime.badgeColor}`}>
                      {regime.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white font-mono">
                    {regime.title}
                  </h4>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {regime.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                    Recommended Strategies:
                  </span>
                  <div className="space-y-2">
                    {regime.strategies.map((strat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-mono text-gray-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{strat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
