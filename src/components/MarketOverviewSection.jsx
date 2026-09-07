import React, { useState, useEffect } from 'react';
import { getIndices, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';
import {
  ShieldAlert,
  Calculator,
  Calendar,
  Activity,
  Globe2,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Zap
} from 'lucide-react';

export default function MarketOverviewSection() {
  const { setActiveSymbol, marketStatus } = useMarket();
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('15:30 IST');

  // Global Triggers State
  const [globalTriggers, setGlobalTriggers] = useState({
    vix: { price: 18.53, change: 0.25, pChange: 1.37 },
    crude: { price: 96.28, change: -0.45, pChange: -0.47 },
    usdinr: { price: 94.48, change: 0.12, pChange: 0.13 }
  });

  // Position Sizing Calculator Inputs
  const [capital, setCapital] = useState(1000000); // ₹10,00,000 default
  const [riskPercent, setRiskPercent] = useState(1.5); // 1.5%
  const [entryPrice, setEntryPrice] = useState(23800);
  const [stopLossPrice, setStopLossPrice] = useState(23700);
  const [targetPrice, setTargetPrice] = useState(24000);
  const [selectedInstrument, setSelectedInstrument] = useState('NIFTY');

  // Collapsible Rules Card
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  // Instruments config with lot sizes
  const INSTRUMENTS = {
    NIFTY: { name: 'NIFTY 50', lotSize: 25, marginPerLot: 115000 },
    BANKNIFTY: { name: 'BANK NIFTY', lotSize: 15, marginPerLot: 110000 },
    FINNIFTY: { name: 'NIFTY FIN SERVICE', lotSize: 40, marginPerLot: 95000 },
    SENSEX: { name: 'SENSEX', lotSize: 10, marginPerLot: 125000 }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMarketIndices = async () => {
      try {
        const res = await getIndices();
        if (isMounted && res.success) {
          setIndices(res.data);
          if (res.timestamp) setLastUpdatedTime(res.timestamp);

          // Find India VIX
          const vixItem = res.data.find(i => i.symbol === 'INDIA VIX');
          if (vixItem) {
            setGlobalTriggers(prev => ({
              ...prev,
              vix: { price: vixItem.price, change: vixItem.change, pChange: vixItem.pChange }
            }));
          }
        }

        // Fetch Crude Oil & USD-INR
        const crudeQ = await getQuote('CRUDE OIL');
        const inrQ = await getQuote('USD-INR');
        if (isMounted) {
          if (crudeQ.success && crudeQ.data) {
            setGlobalTriggers(prev => ({
              ...prev,
              crude: { price: crudeQ.data.price, change: crudeQ.data.change, pChange: crudeQ.data.pChange }
            }));
          }
          if (inrQ.success && inrQ.data) {
            setGlobalTriggers(prev => ({
              ...prev,
              usdinr: { price: inrQ.data.price, change: inrQ.data.change, pChange: inrQ.data.pChange }
            }));
          }
        }
      } catch (e) {
        console.error('Error loading market indices:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarketIndices();
    const interval = setInterval(() => {
      if (marketStatus.isOpen) {
        fetchMarketIndices();
      }
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [marketStatus.isOpen]);

  const handleCardClick = (symbol) => {
    setActiveSymbol(symbol);
    const chartSection = document.getElementById('charts-section');
    if (chartSection) {
      chartSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // VIX Zone calculation
  const vixVal = globalTriggers.vix.price;
  const getVixZone = (val) => {
    if (val < 13.5) {
      return {
        zone: 'LOW VOLATILITY (COMPRESSED)',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        strategyNote: 'Low Premium Environment: Ideal for Defined-Risk Debit Spreads, Bull Put Credit Spreads & Calendar Spreads. Avoid naked option selling due to surge risk.'
      };
    } else if (val <= 18.5) {
      return {
        zone: 'MEDIUM VOLATILITY (OPTIMAL)',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        strategyNote: 'Optimal Option Selling Zone: High statistical probability for Short Strangles, Iron Condors & Ratio Spreads with favorable theta decay rate.'
      };
    } else {
      return {
        zone: 'HIGH VOLATILITY (EXPANDED / FEAR)',
        badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        strategyNote: 'High Premium Expansion: Favorable for Deep OTM Short Straddles & Credit Spreads. Strict stop-loss discipline required due to wide intraday swings.'
      };
    }
  };

  const currentVixZone = getVixZone(vixVal);

  // Position Calculator Math
  const maxRiskAmount = (capital * riskPercent) / 100;
  const riskPerPoint = Math.abs(entryPrice - stopLossPrice);
  const targetPerPoint = Math.abs(targetPrice - entryPrice);
  const currentInst = INSTRUMENTS[selectedInstrument];

  const totalMaxQuantity = riskPerPoint > 0 ? Math.floor(maxRiskAmount / riskPerPoint) : 0;
  const recommendedLots = Math.max(1, Math.floor(totalMaxQuantity / currentInst.lotSize));
  const actualQuantity = recommendedLots * currentInst.lotSize;
  const actualRiskAmount = actualQuantity * riskPerPoint;
  const estimatedMargin = recommendedLots * currentInst.marginPerLot;
  const riskRewardRatio = riskPerPoint > 0 ? (targetPerPoint / riskPerPoint).toFixed(2) : 0;

  // Economic Calendar Playbook
  const ECONOMIC_EVENTS = [
    {
      event: 'RBI Interest Rate Policy Decision',
      frequency: 'Bi-Monthly',
      impact: 'CRITICAL',
      impactBadge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      description: 'Repo rate announcement drives Bank NIFTY & Fin NIFTY rate-sensitive volatility.',
      strategy: 'Deploy Delta-Neutral Non-Directional Strangle prior to decision; harvest IV crush post-release.'
    },
    {
      event: 'India CPI Inflation Data',
      frequency: 'Monthly',
      impact: 'HIGH',
      impactBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      description: 'Macro Consumer Price Index reading determines bond yield trajectory and currency moves.',
      strategy: 'Hedge direction with Bull Put or Bear Call Spreads near structural support levels.'
    },
    {
      event: 'India Quarterly GDP Growth Rate',
      frequency: 'Quarterly',
      impact: 'HIGH',
      impactBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      description: 'Economic expansion metric driving broad market NIFTY 50 institutional fund flows.',
      strategy: 'Monitor 1D ATR expansion; trade breakout iron condors with wide wings.'
    },
    {
      event: 'US Federal Reserve FOMC Policy Rate',
      frequency: '8 Times / Year',
      impact: 'CRITICAL',
      impactBadge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      description: 'Global liquidity anchor influencing IT sector (TCS, INFY) and FII capital flows.',
      strategy: 'Hedge overnight gap risk using OTM protective puts or defined-risk spreads.'
    }
  ];

  return (
    <section id="intelligence" className="relative bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              MARKET INTELLIGENCE & VOLATILITY
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              THE MARKET INTELLIGENCE HUB.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Live index intelligence, global macro triggers, volatility zones, and advanced options risk calculators.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#111111] border border-[#222222] px-3.5 py-1.5 rounded-md text-xs font-mono text-gray-300">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>UPDATED: {lastUpdatedTime}</span>
            <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          </div>
        </div>

        {/* 1. Volatility & Market Sentiment Bar */}
        <div className="bg-gradient-to-r from-[#0d0d0f] via-[#121217] to-[#0d0d0f] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            <div className="flex items-center space-x-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                    LIVE INDIA VIX SENTIMENT
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-extrabold border ${currentVixZone.badgeColor}`}>
                    {vixVal.toFixed(2)} — {currentVixZone.zone}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1 font-mono">
                  VOLATILITY REGIME ANALYSIS
                </h3>
              </div>
            </div>

            <div className="bg-neutral-900/90 border border-white/10 p-4 rounded-xl max-w-xl text-xs font-mono text-gray-300 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">STRATEGY DEPLOYMENT GUIDANCE:</span>
              {currentVixZone.strategyNote}
            </div>

          </div>
        </div>

        {/* 2. Global Market Triggers */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">
            <Globe2 className="w-4 h-4" />
            <span>GLOBAL MACRO TRIGGERS FOR OPTIONS TRADERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Crude Oil */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-amber-500/40 rounded-xl p-5 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase">COMMODITY TRIGGER</span>
                  <h4 className="text-lg font-bold text-white font-mono">CRUDE OIL (BRENT)</h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${globalTriggers.crude.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {globalTriggers.crude.change >= 0 ? '+' : ''}{globalTriggers.crude.pChange.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-white">${globalTriggers.crude.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-mono">/ barrel</span>
              </div>

              <p className="mt-3 text-xs text-gray-400 font-sans border-t border-white/5 pt-3 leading-relaxed">
                Directly influences inflation expectations, paint, auto & aviation margins. Surge triggers put buying across cyclical equities.
              </p>
            </div>

            {/* USD-INR */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-amber-500/40 rounded-xl p-5 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase">CURRENCY TRIGGER</span>
                  <h4 className="text-lg font-bold text-white font-mono">USD / INR EXCHANGE RATE</h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${globalTriggers.usdinr.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {globalTriggers.usdinr.change >= 0 ? '+' : ''}{globalTriggers.usdinr.pChange.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-white">₹{globalTriggers.usdinr.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-mono">per USD</span>
              </div>

              <p className="mt-3 text-xs text-gray-400 font-sans border-t border-white/5 pt-3 leading-relaxed">
                Rupee depreciation acts as an export revenue tailwind for NIFTY IT (TCS, INFY) while raising import cost pressures.
              </p>
            </div>

            {/* India VIX */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-amber-500/40 rounded-xl p-5 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase">VOLATILITY INDEX</span>
                  <h4 className="text-lg font-bold text-white font-mono">INDIA VIX INDEX</h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${globalTriggers.vix.change >= 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {globalTriggers.vix.change >= 0 ? '+' : ''}{globalTriggers.vix.pChange.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-2xl font-black font-mono text-amber-400">{globalTriggers.vix.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-mono">pts</span>
              </div>

              <p className="mt-3 text-xs text-gray-400 font-sans border-t border-white/5 pt-3 leading-relaxed">
                Primary options pricing variable. Determines call/put option premium size and expected 30-day annualized NIFTY standard deviation.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Real-Time Index Cards */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">
            <Layers className="w-4 h-4" />
            <span>REAL-TIME BENCHMARK INDICES</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indices.map((idx) => {
                const isPositive = idx.change >= 0;
                const formattedPrice = idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                const formattedChange = (isPositive ? '+' : '') + idx.change.toFixed(2);
                const formattedPChange = (isPositive ? '+' : '') + idx.pChange.toFixed(2) + '%';

                return (
                  <div
                    key={idx.symbol}
                    onClick={() => handleCardClick(idx.symbol)}
                    className="group relative bg-[#0a0a0a] border border-[#1f1f1f] hover:border-amber-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,169,60,0.1)] cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-wide font-mono group-hover:text-amber-400 transition-colors">
                          {idx.symbol}
                        </h3>
                        <p className="text-xs text-gray-400 font-sans mt-0.5">{idx.name}</p>
                      </div>

                      <div
                        className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                          isPositive
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                            : 'bg-red-950/40 text-red-400 border-red-800/50'
                        }`}
                      >
                        <span>{isPositive ? '↗' : '↘'}</span>
                        <span>{formattedPChange}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-6">
                      <div className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formattedPrice}
                      </div>
                      <div className={`text-sm font-mono font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formattedChange}
                      </div>
                    </div>

                    <div className="border-t border-[#181818] pt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">HIGH</span>
                        <span className="text-gray-200 font-medium">{idx.high?.toLocaleString('en-IN') || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">LOW</span>
                        <span className="text-gray-200 font-medium">{idx.low?.toLocaleString('en-IN') || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">OPEN</span>
                        <span className="text-gray-200 font-medium">{idx.open?.toLocaleString('en-IN') || '—'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Advanced Risk & Position Sizing Calculator & Quick Cheat Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Risk Calculator */}
          <div className="lg:col-span-7 bg-[#0d0d10] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono text-white uppercase">
                    POSITION SIZING & RISK CALCULATOR
                  </h3>
                  <p className="text-xs text-gray-400">
                    Calculate lot allocation and risk exposure before executing trades.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Instrument Selection */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Instrument / Index
                </label>
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                >
                  <option value="NIFTY">NIFTY 50 (Lot: 25)</option>
                  <option value="BANKNIFTY">BANK NIFTY (Lot: 15)</option>
                  <option value="FINNIFTY">FIN NIFTY (Lot: 40)</option>
                  <option value="SENSEX">SENSEX (Lot: 10)</option>
                </select>
              </div>

              {/* Total Capital */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Total Trading Capital (₹)
                </label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Risk Percent */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Entry Price (₹)
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Stop Loss Price */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Stop Loss Price (₹)
                </label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-rose-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Results Grid */}
            <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-5 space-y-4 font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase">Max Allowed Risk</span>
                  <span className="text-lg font-bold text-amber-400">
                    ₹{maxRiskAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase">Recommended Lots</span>
                  <span className="text-lg font-bold text-white">
                    {recommendedLots} {recommendedLots === 1 ? 'Lot' : 'Lots'} ({actualQuantity} qty)
                  </span>
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                  <span className="block text-[10px] text-gray-400 uppercase">Risk / Reward Ratio</span>
                  <span className={`text-lg font-bold ${Number(riskRewardRatio) >= 1.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    1 : {riskRewardRatio}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5 gap-2">
                <span>Actual Risk Amount: <strong className="text-rose-400">₹{actualRiskAmount.toLocaleString('en-IN')}</strong></span>
                <span>Est. Margin Required: <strong className="text-amber-400">₹{estimatedMargin.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

          </div>

          {/* Quick Strategy Cheat Sheet */}
          <div className="lg:col-span-5 bg-[#0d0d10] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div
              className="flex items-center justify-between cursor-pointer border-b border-white/10 pb-3"
              onClick={() => setShowCheatSheet(!showCheatSheet)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono text-white uppercase">
                    RISK MANAGEMENT CHEAT SHEET
                  </h3>
                  <p className="text-[11px] text-gray-400">Core DeltaFox execution rules</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                {showCheatSheet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showCheatSheet && (
              <div className="space-y-3 text-xs font-mono text-gray-300">
                <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">1% Capital Preservation Rule</strong>
                    Never allocate or risk more than 1.5% of total portfolio equity on a single non-directional options leg.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">30% Unutilized Cash Buffer</strong>
                    Maintain a minimum 30% liquid cash buffer to absorb sharp India VIX expansion without margin calls.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Delta Boundary Adjustment</strong>
                    Rebalance or roll untested option wings once tested strike Delta breaches 0.35.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 block font-bold mb-0.5">Final 3-Day Gamma Spike Alert</strong>
                    Close or convert short ITM/ATM option positions into defined-risk spreads inside 72 hours to expiry.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 5. Economic Calendar Playbook */}
        <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono text-white uppercase">
                ECONOMIC CALENDAR & MACRO EVENT PLAYBOOK
              </h3>
              <p className="text-xs text-gray-400">
                Key scheduled macro event releases and option volatility strategy setups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ECONOMIC_EVENTS.map((item, idx) => (
              <div key={idx} className="bg-neutral-900/90 border border-white/5 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">{item.frequency}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.impactBadge}`}>
                    {item.impact} IMPACT
                  </span>
                </div>

                <h4 className="text-base font-bold font-mono text-white">{item.event}</h4>

                <p className="text-xs text-gray-400 leading-relaxed font-sans">{item.description}</p>

                <div className="pt-2 border-t border-white/5 text-xs font-mono text-gray-300">
                  <strong className="text-amber-400 font-bold">PLAYBOOK STRATEGY: </strong>
                  {item.strategy}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
