import React, { useEffect, useState } from 'react';
import { Compass, Cpu, ShieldCheck, Zap, TrendingUp, TrendingDown, ArrowUpRight, Scale } from 'lucide-react';
import { getMarketSentiment } from '../services/marketData';

export default function SentimentAndPhilosophySection() {
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    async function loadSentiment() {
      const res = await getMarketSentiment();
      if (res.success) {
        setSentiment(res.sentiment);
      }
    }
    loadSentiment();
  }, []);

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Market Intelligence / Sentiment Grid */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
                <Compass className="w-4 h-4" />
                <span>Verified Quantitative Indicators</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                MARKET SENTIMENT & INSTITUTIONAL FLOWS
              </h2>
              <p className="mt-2 text-sm text-gray-400 max-w-xl">
                Real-time sentiment metrics, India VIX volatility index, FII/DII institutional activity, and advance/decline breadth.
              </p>
            </div>
          </div>

          {sentiment && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* NIFTY Sentiment */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-[11px] font-mono text-gray-400 uppercase">NIFTY 50 SENTIMENT</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {sentiment.niftySentiment}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{sentiment.niftyScore}/100</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sentiment.niftyScore}%` }} />
                </div>
              </div>

              {/* India VIX Volatility */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-[11px] font-mono text-gray-400 uppercase">INDIA VIX (VOLATILITY)</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold font-mono text-amber-400">
                    {sentiment.indiaVix}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {sentiment.vixChange} (Subdued)
                  </span>
                </div>
                <p className="text-[11px] font-mono text-gray-400">Low volatility regime favor option writing strategies.</p>
              </div>

              {/* FII Institutional Activity */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-[11px] font-mono text-gray-400 uppercase">FII NET FLOWS</div>
                <div className="text-2xl font-extrabold font-mono text-emerald-400">
                  +₹{sentiment.fiiActivity.net} Cr
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>BUY: ₹{sentiment.fiiActivity.buy}</span>
                  <span>SELL: ₹{sentiment.fiiActivity.sell}</span>
                </div>
              </div>

              {/* Advance / Decline Ratio */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="text-[11px] font-mono text-gray-400 uppercase">ADVANCE / DECLINE</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold font-mono text-white">
                    {sentiment.advanceDecline.ratio}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">{sentiment.marketBreadth}</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span className="text-emerald-400">ADV: {sentiment.advanceDecline.advances}</span>
                  <span className="text-rose-400">DEC: {sentiment.advanceDecline.declines}</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* DELTAFOX PHILOSOPHY SECTION */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/30 relative overflow-hidden bg-gradient-to-br from-neutral-950 via-[#0a0a0c] to-black">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold block">
              THE DELTAFOX PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              WHERE DATA MEETS DISCIPLINE.
            </h2>
            <p className="text-xl sm:text-2xl font-serif text-amber-200 italic">
              “TRADE THE PROBABILITY. MANAGE THE RISK.”
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-lg border border-amber-500/40">
                01
              </div>
              <h3 className="text-xl font-bold font-mono text-white">DATA</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Real-time market intelligence, quantitative volatility skew, option open interest distribution, and algorithmic analytics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg border border-emerald-500/40">
                02
              </div>
              <h3 className="text-xl font-bold font-mono text-white">STRATEGY</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Systematic options frameworks structured around mathematical probabilities, defined-risk spreads, and high-probability decay.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold text-lg border border-rose-500/40">
                03
              </div>
              <h3 className="text-xl font-bold font-mono text-white">RISK</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Disciplined capital allocation, strict position sizing, stop-loss execution, and drawdown management.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
