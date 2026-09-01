import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid
} from 'recharts';
import { Shield, TrendingUp, TrendingDown, Layers, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

const STRATEGIES_DATA = [
  {
    id: 'short-strangle',
    name: 'Short Strangle',
    marketView: 'Neutral / Low Volatility (Range Bound)',
    idealCondition: 'Expect the market or stock to trade within a specific price range until expiry.',
    entryLogic: 'Sell 1 OTM Call Option and Sell 1 OTM Put Option simultaneously.',
    exitLogic: 'Close both legs when 50-70% max premium profit is reached or stop loss at 2x premium.',
    maxProfit: 'Net Credit Received (Total Premium)',
    maxRisk: 'Unlimited (Requires strict stop-loss discipline)',
    stopLossConcept: 'Close leg if underlying touches short strike or total loss exceeds 1.5x credit.',
    profitTarget: '50% of maximum collectable credit.',
    breakeven: 'Lower: Put Strike - Net Credit | Upper: Call Strike + Net Credit',
    payoffData: [
      { spot: 21000, pnl: -600 },
      { spot: 21400, pnl: -200 },
      { spot: 21700, pnl: 250 }, // Lower Breakeven
      { spot: 22000, pnl: 400 }, // Lower Strike (Put)
      { spot: 22123, pnl: 400 }, // Current Spot
      { spot: 22300, pnl: 400 }, // Upper Strike (Call)
      { spot: 22600, pnl: 250 }, // Upper Breakeven
      { spot: 22900, pnl: -200 },
      { spot: 23200, pnl: -600 }
    ]
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    marketView: 'Strict Neutral (Defined Risk)',
    idealCondition: 'Low IV crush expected within defined upper and lower price boundaries.',
    entryLogic: 'Sell 1 OTM Put, Buy 1 Further OTM Put, Sell 1 OTM Call, Buy 1 Further OTM Call.',
    exitLogic: 'Exit at 50% max profit or if underlying breaks inner short strikes.',
    maxProfit: 'Net Premium Received',
    maxRisk: 'Defined (Width of Strikes - Net Premium)',
    stopLossConcept: 'Fixed defined risk cap ensures catastrophic protection.',
    profitTarget: '50% - 60% of net premium.',
    breakeven: 'Lower: Short Put - Net Credit | Upper: Short Call + Net Credit',
    payoffData: [
      { spot: 21000, pnl: -350 },
      { spot: 21300, pnl: -350 }, // Long Put floor
      { spot: 21700, pnl: 200 },
      { spot: 22000, pnl: 300 }, // Max Profit zone
      { spot: 22123, pnl: 300 },
      { spot: 22300, pnl: 300 },
      { spot: 22600, pnl: 200 },
      { spot: 22900, pnl: -350 }, // Long Call ceiling
      { spot: 23200, pnl: -350 }
    ]
  },
  {
    id: 'bull-put-spread',
    name: 'Bull Put Spread',
    marketView: 'Moderately Bullish',
    idealCondition: 'Expect underlying to stay above key support level.',
    entryLogic: 'Sell 1 OTM Put Option and Buy 1 Further OTM Put Option for protection.',
    exitLogic: 'Exit near expiry or when 75% profit is achieved.',
    maxProfit: 'Net Credit Received',
    maxRisk: 'Strike Difference - Net Credit',
    stopLossConcept: 'Exit if underlying spot breaches short put strike.',
    profitTarget: '70% - 80% net credit.',
    breakeven: 'Short Put Strike - Net Credit',
    payoffData: [
      { spot: 21000, pnl: -400 },
      { spot: 21400, pnl: -400 },
      { spot: 21800, pnl: 0 }, // Breakeven
      { spot: 22000, pnl: 250 }, // Max Profit
      { spot: 22300, pnl: 250 },
      { spot: 22700, pnl: 250 }
    ]
  },
  {
    id: 'bear-call-spread',
    name: 'Bear Call Spread',
    marketView: 'Moderately Bearish',
    idealCondition: 'Expect market to stay below major resistance zone.',
    entryLogic: 'Sell 1 OTM Call Option and Buy 1 Higher OTM Call Option.',
    exitLogic: 'Hold to let theta decay or exit on resistance test.',
    maxProfit: 'Net Credit Received',
    maxRisk: 'Strike Difference - Net Credit',
    stopLossConcept: 'Close position if short call is breached.',
    profitTarget: '65% - 75% max profit.',
    breakeven: 'Short Call Strike + Net Credit',
    payoffData: [
      { spot: 21500, pnl: 250 },
      { spot: 21900, pnl: 250 },
      { spot: 22200, pnl: 0 }, // Breakeven
      { spot: 22500, pnl: -400 },
      { spot: 22900, pnl: -400 }
    ]
  },
  {
    id: 'covered-call',
    name: 'Covered Call',
    marketView: 'Mildly Bullish to Neutral',
    idealCondition: 'Own underlying stock and generate income via call writing.',
    entryLogic: 'Hold 100 shares (or 1 futures contract) and Sell 1 OTM Call Option.',
    exitLogic: 'If stock rallies above strike, let shares get assigned or buy back call.',
    maxProfit: '(Call Strike - Stock Purchase Price) + Premium',
    maxRisk: 'Stock Price - Premium (Downside risk on stock ownership)',
    stopLossConcept: 'Trailing stop on underlying stock position.',
    profitTarget: 'Full premium decay if stock remains under strike.',
    breakeven: 'Stock Purchase Price - Call Premium Received',
    payoffData: [
      { spot: 20000, pnl: -1500 },
      { spot: 21000, pnl: -500 },
      { spot: 21500, pnl: 0 },
      { spot: 22000, pnl: 500 },
      { spot: 22500, pnl: 800 }, // Profit capped at Call strike
      { spot: 23500, pnl: 800 }
    ]
  },
  {
    id: 'cash-secured-put',
    name: 'Cash Secured Put',
    marketView: 'Neutral to Bullish',
    idealCondition: 'Willing to buy underlying stock at lower strike or collect income.',
    entryLogic: 'Sell 1 OTM Put Option while holding 100% cash to buy shares if assigned.',
    exitLogic: 'Take assignment to own quality stock at discount or close at 50% profit.',
    maxProfit: 'Put Premium Collected',
    maxRisk: 'Put Strike - Premium Received (If stock drops to zero)',
    stopLossConcept: 'Evaluate fundamental thesis before assignment.',
    profitTarget: '50% - 70% of premium.',
    breakeven: 'Put Strike - Premium Received',
    payoffData: [
      { spot: 20000, pnl: -1600 },
      { spot: 21000, pnl: -600 },
      { spot: 21600, pnl: 0 },
      { spot: 22000, pnl: 400 },
      { spot: 23000, pnl: 400 }
    ]
  },
  {
    id: 'long-straddle',
    name: 'Long Straddle',
    marketView: 'High Volatility Explosion Expected',
    idealCondition: 'Major earnings announcement, election, or RBI policy event.',
    entryLogic: 'Buy 1 ATM Call and Buy 1 ATM Put simultaneously.',
    exitLogic: 'Exit quickly after violent breakout before theta decay acceleration.',
    maxProfit: 'Unlimited in either direction',
    maxRisk: 'Total Premium Paid for Call + Put',
    stopLossConcept: 'Time-based exit prior to severe IV crush.',
    profitTarget: '50% - 100% return on total debit.',
    breakeven: 'Lower: Strike - Total Debit | Upper: Strike + Total Debit',
    payoffData: [
      { spot: 20500, pnl: 1100 },
      { spot: 21200, pnl: 400 },
      { spot: 21600, pnl: 0 },
      { spot: 22000, pnl: -500 }, // Max Risk at ATM
      { spot: 22400, pnl: 0 },
      { spot: 22800, pnl: 400 },
      { spot: 23500, pnl: 1100 }
    ]
  },
  {
    id: 'long-strangle',
    name: 'Long Strangle',
    marketView: 'Extreme Volatility Breakout (Lower Cost)',
    idealCondition: 'Expect huge sharp directional move at cheaper entry cost than straddle.',
    entryLogic: 'Buy 1 OTM Call Option and Buy 1 OTM Put Option.',
    exitLogic: 'Exit upon sharp breakout in underlying.',
    maxProfit: 'Unlimited',
    maxRisk: 'Total Premium Paid',
    stopLossConcept: 'Strict stop loss at 40% premium decay.',
    profitTarget: '100%+ ROI on debit.',
    breakeven: 'Lower: Put Strike - Total Debit | Upper: Call Strike + Total Debit',
    payoffData: [
      { spot: 20500, pnl: 900 },
      { spot: 21200, pnl: 200 },
      { spot: 21400, pnl: 0 },
      { spot: 22000, pnl: -300 }, // Flat Max Risk between OTM strikes
      { spot: 22400, pnl: -300 },
      { spot: 23000, pnl: 0 },
      { spot: 23500, pnl: 900 }
    ]
  }
];

export default function OptionsStrategiesSection() {
  const [activeStrategyId, setActiveStrategyId] = useState('short-strangle');

  const activeStrategy = STRATEGIES_DATA.find(s => s.id === activeStrategyId) || STRATEGIES_DATA[0];

  return (
    <section id="strategies" className="py-24 bg-[#050507] border-t border-white/5 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Layers className="w-4 h-4" />
            <span>Systematic Frameworks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            STRATEGIES BUILT FOR DIFFERENT MARKET CONDITIONS.
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Select a systematic options strategy to inspect entry logic, exit parameters, risk parameters, and animated payoff curves.
          </p>
        </div>

        {/* 3D Horizontal Strategy Selector Gallery */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {STRATEGIES_DATA.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStrategyId(st.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-300 transform border ${
                activeStrategyId === st.id
                  ? 'bg-amber-500 text-black border-amber-400 scale-105 shadow-[0_0_25px_rgba(217,119,6,0.35)]'
                  : 'bg-neutral-900/80 text-gray-400 hover:text-white border-white/10 hover:border-amber-500/30'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* Strategy Detail & Interactive Animated Payoff Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Strategy Details (Left Panel) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 space-y-6">

            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">SELECTED FRAMEWORK</span>
              <h3 className="text-2xl font-extrabold text-white font-mono">{activeStrategy.name}</h3>
              <p className="text-xs font-semibold text-emerald-400 mt-1">{activeStrategy.marketView}</p>
            </div>

            <div className="space-y-4 text-xs font-sans text-gray-300 divide-y divide-white/5">
              <div className="pt-2">
                <span className="font-mono text-gray-400 text-[11px] block uppercase">IDEAL MARKET CONDITION</span>
                <p className="mt-1 leading-relaxed text-gray-200">{activeStrategy.idealCondition}</p>
              </div>

              <div className="pt-3">
                <span className="font-mono text-gray-400 text-[11px] block uppercase">ENTRY LOGIC</span>
                <p className="mt-1 leading-relaxed text-gray-200">{activeStrategy.entryLogic}</p>
              </div>

              <div className="pt-3">
                <span className="font-mono text-gray-400 text-[11px] block uppercase">EXIT LOGIC</span>
                <p className="mt-1 leading-relaxed text-gray-200">{activeStrategy.exitLogic}</p>
              </div>

              <div className="pt-3 grid grid-cols-2 gap-4 font-mono">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">MAX REWARD</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">{activeStrategy.maxProfit}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">MAX RISK</span>
                  <span className="text-rose-400 font-bold block mt-0.5">{activeStrategy.maxRisk}</span>
                </div>
              </div>

              <div className="pt-3">
                <span className="font-mono text-gray-400 text-[11px] block uppercase">BREAKEVEN LEVEL(S)</span>
                <span className="text-amber-400 font-mono font-semibold block mt-1 text-[11px]">
                  {activeStrategy.breakeven}
                </span>
              </div>
            </div>

          </div>

          {/* Payoff Curve Diagram (Right Panel) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 space-y-4">

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h4 className="text-sm font-extrabold font-mono text-white uppercase">ANIMATED PAYOFF PROFILE</h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">Underlying Spot vs Profit / Loss at Expiry</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>PROFIT ZONE</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="w-2 h-2 bg-rose-500 rounded-full" />
                  <span>RISK ZONE</span>
                </span>
              </div>
            </div>

            {/* Payoff Chart */}
            <div className="h-[340px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeStrategy.payoffData}>
                  <defs>
                    <linearGradient id="payoffGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="spot" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'P&L']}
                    labelFormatter={(label) => `Spot Price: ₹${label}`}
                  />
                  <ReferenceLine y={0} stroke="#ffffff" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="pnl" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#payoffGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 text-[10px] font-mono text-gray-500 text-center border-t border-white/5">
              Conceptual payoff profile diagram calculated at expiration. Real-time options pricing subject to IV skew and time decay dynamics.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
