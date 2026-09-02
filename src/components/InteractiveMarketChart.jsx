import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getHistoricalData, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function InteractiveMarketChart() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState([]);
  const [quoteInfo, setQuoteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartAndQuote() {
      setLoading(true);
      const [histRes, quoteRes] = await Promise.all([
        getHistoricalData(activeSymbol, timeframe),
        getQuote(activeSymbol)
      ]);

      if (histRes.success) setChartData(histRes.data);
      if (quoteRes.success) setQuoteInfo(quoteRes.data);
      setLoading(false);
    }

    loadChartAndQuote();
    const interval = setInterval(loadChartAndQuote, 10000);
    return () => clearInterval(interval);
  }, [activeSymbol, timeframe]);

  const isPositive = quoteInfo ? quoteInfo.change >= 0 : true;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-500/30 shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden">

      {/* Control Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
              YAHOO FINANCE LIVE DATA
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-3 mt-1">
            <h3 className="text-2xl font-extrabold text-white font-mono tracking-wide">
              {activeSymbol}
            </h3>
            {quoteInfo && (
              <span className="text-xl font-mono font-bold text-gray-200">
                ₹{quoteInfo.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            )}
            {quoteInfo && (
              <span className={`text-xs font-mono font-bold flex items-center space-x-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 inline" />}
                <span>{isPositive ? '+' : ''}{quoteInfo.change.toFixed(2)} ({isPositive ? '+' : ''}{quoteInfo.pChange.toFixed(2)}%)</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/10">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Symbol Selector */}
          <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-amber-500/40">
            <span className="text-[11px] font-mono text-gray-400">SELECT ASSET:</span>
            <select
              value={activeSymbol}
              onChange={(e) => setActiveSymbol(e.target.value)}
              className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {allAvailableSymbols.map((sym) => (
                <option key={sym} value={sym} className="bg-neutral-900 text-white">
                  {sym}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="h-[460px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center space-x-2 text-amber-400 text-sm font-mono">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Live Yahoo Finance Chart Data...</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradientPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="chartGradientNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="#6B7280" fontSize={11} orientation="right" tickFormatter={(val) => val.toLocaleString('en-IN')} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0A0A0C', borderColor: 'rgba(217, 119, 6, 0.4)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Close Price']}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={isPositive ? '#10B981' : '#F43F5E'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={isPositive ? 'url(#chartGradientPos)' : 'url(#chartGradientNeg)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
