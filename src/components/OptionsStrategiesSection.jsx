import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid
} from 'recharts';
import { Shield, TrendingUp, TrendingDown, Layers, AlertTriangle } from 'lucide-react';

const MARKET_CATEGORIES = [
  { id: 'all', name: 'ALL STRATEGIES' },
  { id: 'sideways', name: 'SIDEWAYS MARKET', icon: Layers },
  { id: 'bullish', name: 'BULLISH MARKET', icon: TrendingUp },
  { id: 'bearish', name: 'BEARISH MARKET', icon: TrendingDown },
  { id: 'volatile', name: 'VOLATILE / BREAKOUT', icon: AlertTriangle }
];

const STRATEGIES_DATA = [
  {
    id: 'short-strangle',
    name: 'Short Strangle',
    category: 'sideways',
    categoryLabel: 'Sideways Market',
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
    id: 'short-straddle',
    name: 'Short Straddle',
    category: 'sideways',
    categoryLabel: 'Sideways Market',
    marketView: 'Strict Neutral / High Theta Decay',
    idealCondition: 'Expect underlying spot to stay pinned near central ATM strike until expiry.',
    entryLogic: 'Sell 1 ATM Call Option and Sell 1 ATM Put Option simultaneously.',
    exitLogic: 'Close both legs when 50% max premium profit is reached or stop loss at 1.5x premium.',
    maxProfit: 'Net Premium Received (Total ATM Premium)',
    maxRisk: 'Unlimited (Requires disciplined stop-loss execution)',
    stopLossConcept: 'Close position if underlying spot moves beyond breakeven bounds.',
    profitTarget: '50% of maximum collectable credit.',
    breakeven: 'Lower: ATM Strike - Total Credit | Upper: ATM Strike + Total Credit',
    payoffData: [
      { spot: 21000, pnl: -1000 },
      { spot: 21400, pnl: -500 },
      { spot: 21700, pnl: 0 }, // Breakeven
      { spot: 22000, pnl: 800 }, // Peak Profit at ATM
      { spot: 22300, pnl: 0 }, // Breakeven
      { spot: 22600, pnl: -500 },
      { spot: 23000, pnl: -1000 }
    ]
  },
  {
    id: 'iron-butterfly',
    name: 'Iron Butterfly',
    category: 'sideways',
    categoryLabel: 'Sideways Market',
    marketView: 'Strict Neutral (Defined Risk Peak)',
    idealCondition: 'Expect underlying spot to settle near central ATM strike with defined wing protection.',
    entryLogic: 'Buy 1 OTM Put, Sell 1 ATM Put, Sell 1 ATM Call, Buy 1 OTM Call.',
    exitLogic: 'Exit at 50% max profit or when underlying tests outer wing protection.',
    maxProfit: 'Net Premium Received (Peak at ATM)',
    maxRisk: 'Defined (Wing Width - Net Credit)',
    stopLossConcept: 'Capped max loss defined by long wing protection.',
    profitTarget: '50% - 60% of net credit.',
    breakeven: 'Lower: ATM Strike - Net Credit | Upper: ATM Strike + Net Credit',
    payoffData: [
      { spot: 21000, pnl: -400 },
      { spot: 21400, pnl: -400 }, // Long Put Wing
      { spot: 21700, pnl: 100 },
      { spot: 22000, pnl: 600 }, // Peak ATM Profit
      { spot: 22300, pnl: 100 },
      { spot: 22600, pnl: -400 }, // Long Call Wing
      { spot: 23000, pnl: -400 }
    ]
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    category: 'sideways',
    categoryLabel: 'Sideways Market',
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
    id: 'partial-iron-condor',
    name: 'Partial Iron Condor',
    category: 'sideways',
    categoryLabel: 'Sideways Market',
    marketView: 'Skewed Neutral / Asymmetric Risk',
    idealCondition: 'Expect rangebound market with directional bias on one wing (hedged on higher probability risk side).',
    entryLogic: 'Sell 1 OTM Put and Sell 1 OTM Call, while Buying 1 protective wing (Call or Put) on the biased side.',
    exitLogic: 'Exit at 50% max profit or if unprotected short strike is tested.',
    maxProfit: 'Net Premium Received',
    maxRisk: 'Defined on protected side, Managed via Stop Loss on open side.',
    stopLossConcept: 'Close unhedged short leg if spot approaches short strike.',
    profitTarget: '50% - 60% max credit.',
    breakeven: 'Lower: Short Put - Net Credit | Upper: Short Call + Net Credit',
    payoffData: [
      { spot: 21000, pnl: -500 },
      { spot: 21400, pnl: -200 },
      { spot: 21700, pnl: 250 },
      { spot: 22000, pnl: 380 },
      { spot: 22123, pnl: 380 },
      { spot: 22300, pnl: 380 },
      { spot: 22600, pnl: 250 },
      { spot: 22900, pnl: -300 }, // Protected wing floor
      { spot: 23200, pnl: -300 }
    ]
  },
  {
    id: 'bull-call-spread',
    name: 'Bull Call Spread',
    category: 'bullish',
    categoryLabel: 'Bullish Market',
    marketView: 'Moderately Bullish (Defined Risk & Reward)',
    idealCondition: 'Expect underlying asset to rise moderately above the long call strike.',
    entryLogic: 'Buy 1 ITM/ATM Call Option and Sell 1 OTM Call Option.',
    exitLogic: 'Exit when price reaches short call strike target or near expiry.',
    maxProfit: 'Difference Between Strikes - Net Debit Paid',
    maxRisk: 'Net Debit Paid',
    stopLossConcept: 'Strict risk cap limited to net debit paid.',
    profitTarget: '70% - 80% of max potential profit.',
    breakeven: 'Long Call Strike + Net Debit Paid',
    payoffData: [
      { spot: 21000, pnl: -300 },
      { spot: 21500, pnl: -300 },
      { spot: 21800, pnl: 0 }, // Breakeven
      { spot: 22200, pnl: 450 }, // Max Profit
      { spot: 22600, pnl: 450 },
      { spot: 23000, pnl: 450 }
    ]
  },
  {
    id: 'bull-put-spread',
    name: 'Bull Put Spread',
    category: 'bullish',
    categoryLabel: 'Bullish Market',
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
    id: 'bear-put-spread',
    name: 'Bear Put Spread',
    category: 'bearish',
    categoryLabel: 'Bearish Market',
    marketView: 'Moderately Bearish (Defined Risk & Reward)',
    idealCondition: 'Expect underlying asset to fall moderately below the long put strike.',
    entryLogic: 'Buy 1 ITM/ATM Put Option and Sell 1 OTM Put Option.',
    exitLogic: 'Exit when price drops near short put strike target or near expiry.',
    maxProfit: 'Difference Between Strikes - Net Debit Paid',
    maxRisk: 'Net Debit Paid',
    stopLossConcept: 'Strict risk cap limited to net debit paid.',
    profitTarget: '70% - 80% of max potential profit.',
    breakeven: 'Long Put Strike - Net Debit Paid',
    payoffData: [
      { spot: 21000, pnl: 450 }, // Max Profit
      { spot: 21400, pnl: 450 },
      { spot: 21800, pnl: 0 }, // Breakeven
      { spot: 22100, pnl: -300 },
      { spot: 22500, pnl: -300 },
      { spot: 23000, pnl: -300 }
    ]
  },
  {
    id: 'bear-call-spread',
    name: 'Bear Call Spread',
    category: 'bearish',
    categoryLabel: 'Bearish Market',
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
    id: 'long-straddle',
    name: 'Long Straddle',
    category: 'volatile',
    categoryLabel: 'Volatile / Breakout',
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
    category: 'volatile',
    categoryLabel: 'Volatile / Breakout',
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeStrategyId, setActiveStrategyId] = useState('short-strangle');

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredStrategies = selectedCategory === 'all'
    ? STRATEGIES_DATA
    : STRATEGIES_DATA.filter(s => s.category === selectedCategory);

  const activeStrategy = STRATEGIES_DATA.find(s => s.id === activeStrategyId) || filteredStrategies[0] || STRATEGIES_DATA[0];

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      const firstInCat = STRATEGIES_DATA.find(s => s.category === catId);
      if (firstInCat) setActiveStrategyId(firstInCat.id);
    }
  };

  // Compute zero baseline offset for green (profit) and red (loss) shading
  const pnlValues = activeStrategy.payoffData.map(d => d.pnl);
  const minPnl = Math.min(...pnlValues);
  const maxPnl = Math.max(...pnlValues);

  const getGradientOffset = () => {
    if (maxPnl <= 0) return 0;
    if (minPnl >= 0) return 1;
    return maxPnl / (maxPnl - minPnl);
  };

  const off = getGradientOffset();

  return (
    <section id="strategies" className="pt-8 sm:pt-10 pb-16 scroll-mt-16 sm:scroll-mt-20 bg-transparent bg-subpage-grid relative overflow-hidden">

      {/* Ambient Radial Glow Effects */}
      <div className="ambient-glow-amber top-1/4 right-10" />
      <div className="ambient-glow-emerald bottom-1/4 left-10" />

      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">

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
            Select a market type or options framework to inspect entry logic, risk profile, and payoff curves.
          </p>
        </div>

        {/* Market Outlook Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                  : 'bg-neutral-900/60 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Responsive Grid/Flex Strategy Pill Selector - Fits Screen Completely without Overflow */}
        <div className="bg-neutral-900/40 p-4 rounded-2xl border border-white/5 max-w-5xl mx-auto">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center mb-3">
            {selectedCategory === 'all' ? 'All Market Strategies' : `${MARKET_CATEGORIES.find(c => c.id === selectedCategory)?.name} Strategies`}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {filteredStrategies.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStrategyId(st.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 transform border ${
                  activeStrategyId === st.id
                    ? 'bg-amber-500 text-black border-amber-400 scale-105 shadow-[0_0_20px_rgba(217,119,6,0.35)]'
                    : 'bg-neutral-900/90 text-gray-300 hover:text-white border-white/10 hover:border-amber-500/40'
                }`}
              >
                <span>{st.name}</span>
                <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded font-normal uppercase ${
                  activeStrategyId === st.id ? 'bg-black/20 text-black' : 'bg-white/5 text-amber-400/80'
                }`}>
                  {st.categoryLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Detail & Interactive Animated Payoff Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Strategy Details (Left Panel) */}
          <div className="lg:col-span-5 bg-[#0a0a0c]/90 rounded-2xl p-6 border border-amber-500/30 space-y-6">

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
          <div className="lg:col-span-7 bg-[#0a0a0c]/90 rounded-2xl p-6 border border-amber-500/30 space-y-4">

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h4 className="text-sm font-extrabold font-mono text-white uppercase">ANIMATED PAYOFF PROFILE</h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">Underlying Spot vs Profit / Loss at Expiry</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                  <span>PROFIT ZONE</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" />
                  <span>RISK / LOSS ZONE</span>
                </span>
              </div>
            </div>

            {/* Payoff Chart */}
            <div className="h-[340px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeStrategy.payoffData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -15 : 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="splitPayoffGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={0} stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset={off} stopColor="#10b981" stopOpacity={0.08} />
                      <stop offset={off} stopColor="#f43f5e" stopOpacity={0.08} />
                      <stop offset={1} stopColor="#f43f5e" stopOpacity={0.45} />
                    </linearGradient>
                    <linearGradient id="splitStrokeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={0} stopColor="#10b981" />
                      <stop offset={off} stopColor="#10b981" />
                      <stop offset={off} stopColor="#f43f5e" />
                      <stop offset={1} stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="spot" stroke="#666" tick={{ fontSize: isMobile ? 10 : 11, fill: '#888' }} />
                  <YAxis stroke="#666" tick={{ fontSize: isMobile ? 10 : 11, fill: '#888' }} width={isMobile ? 40 : 60} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'P&L']}
                    labelFormatter={(label) => `Spot Price: ₹${label}`}
                  />
                  <ReferenceLine y={0} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    baseValue={0}
                    stroke="url(#splitStrokeGradient)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#splitPayoffGradient)"
                  />
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
