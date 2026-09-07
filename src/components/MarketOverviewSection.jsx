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
    vix: { price: 11.60, change: -0.15, pChange: -1.28 },
    crude: { price: 72.85, change: -0.42, pChange: -0.57 },
    usdinr: { price: 83.98, change: 0.04, pChange: 0.05 }
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

  // Economic Calendar & Macro Event Playbook Data
  const ECONOMIC_EVENTS = [
    {
      date: '16 SEP 2026',
      time: '23:30 IST',
      event: 'US Fed FOMC Rate Decision & Policy Statement',
      country: '🇺🇸 UNITED STATES',
      impact: 'CRITICAL',
      impactBadge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      forecast: '4.00%',
      previous: '4.25%',
      description: 'Global benchmark liquidity anchor driving FII equity flows into NIFTY IT & Banking.',
      strategy: 'Hedge overnight gap risk via defined-risk OTM Iron Condors; harvest IV crush post-announcement.'
    },
    {
      date: '02 OCT 2026',
      time: '10:00 IST',
      event: 'RBI Monetary Policy Committee (MPC) Rate Decision',
      country: '🇮🇳 INDIA',
      impact: 'CRITICAL',
      impactBadge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      forecast: '6.00%',
      previous: '6.25%',
      description: 'Direct rate trigger for BANK NIFTY, FIN NIFTY, and rate-sensitive automobile / housing sector.',
      strategy: 'Execute delta-neutral Short Strangles prior to policy speech; capitalize on post-event IV collapse.'
    },
    {
      date: '14 OCT 2026',
      time: '17:30 IST',
      event: 'India Consumer Price Index (CPI Inflation)',
      country: '🇮🇳 INDIA',
      impact: 'HIGH',
      impactBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      forecast: '4.80%',
      previous: '5.10%',
      description: 'Retail inflation metrics guiding RBI monetary stance & sovereign bond yield trajectory.',
      strategy: 'Deploy Bull Put / Bear Call Spreads around structural NIFTY support levels.'
    },
    {
      date: '12 NOV 2026',
      time: '17:30 IST',
      event: 'India Index of Industrial Production (IIP)',
      country: '🇮🇳 INDIA',
      impact: 'MEDIUM',
      impactBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      forecast: '4.50%',
      previous: '4.20%',
      description: 'Core industrial manufacturing output indicator signaling GDP growth momentum.',
      strategy: 'Trade direction-neutral calendars or ratio spreads with controlled position sizing.'
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

        {/* 2. TradingView Market Summary Widget */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
          <tv-market-summary
            symbol-sectors='[{"sectionName":"Commodities","symbols":["TVC:UKOIL","OANDA:NATGASUSD","CAPITALCOM:XAUUSD","CMCMARKETS:SILVERZ2026","IG:COPPER"]}]'
            direction="horizontal"
            mode="custom"
          ></tv-market-summary>
        </div>


        {/* 4. Risk Management Cheat Sheet */}
        <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div
            className="flex items-center justify-between cursor-pointer border-b border-white/10 pb-4"
            onClick={() => setShowCheatSheet(!showCheatSheet)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white uppercase">
                  RISK MANAGEMENT CHEAT SHEET
                </h3>
                <p className="text-xs text-gray-400">Core DeltaFox execution & capital preservation rules</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              {showCheatSheet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showCheatSheet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-300">
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-1 text-sm">1.5% Capital Preservation Rule</strong>
                  Never allocate or risk more than 1.5% of total portfolio equity on a single non-directional options leg.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-1 text-sm">30% Unutilized Cash Buffer</strong>
                  Maintain a minimum 30% liquid cash buffer to absorb sharp India VIX expansion without margin calls.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold mb-1 text-sm">Delta Boundary Adjustment</strong>
                  Rebalance or roll untested option wings once tested strike Delta breaches 0.35.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 block font-bold mb-1 text-sm">Final 3-Day Gamma Spike Alert</strong>
                  Close or convert short ITM/ATM option positions into defined-risk spreads inside 72 hours to expiry.
                </div>
              </div>
            </div>
          )}
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
              <div key={idx} className="bg-neutral-900/90 border border-white/10 hover:border-amber-500/40 rounded-xl p-5 space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
                      {item.date}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{item.time}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.impactBadge}`}>
                    {item.impact} IMPACT
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-0.5">{item.country}</span>
                  <h4 className="text-base font-bold font-mono text-white">{item.event}</h4>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 bg-black/40 p-2.5 rounded-lg text-xs font-mono border border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">FORECAST</span>
                    <span className="text-amber-400 font-bold">{item.forecast}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">PREVIOUS</span>
                    <span className="text-gray-300 font-bold">{item.previous}</span>
                  </div>
                </div>

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
