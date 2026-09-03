import React, { useState, useEffect } from 'react';
import { getHistoricalData, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

export default function ChartSection() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols, marketStatus } = useMarket();
  const [chartData, setChartData] = useState([]);
  const [quote, setQuote] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('AREA'); // 'LINE' or 'AREA'
  const [loading, setLoading] = useState(true);

  // Fetch quote and historical chart data whenever activeSymbol or timeframe changes
  useEffect(() => {
    let isMounted = true;
    const fetchChartAndQuote = async () => {
      setLoading(true);
      try {
        const [quoteRes, histRes] = await Promise.all([
          getQuote(activeSymbol),
          getHistoricalData(activeSymbol, timeframe)
        ]);

        if (isMounted) {
          if (quoteRes.success) setQuote(quoteRes.data);
          if (histRes.success) setChartData(histRes.data);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChartAndQuote();
  }, [activeSymbol, timeframe]);

  const isPositive = quote ? (quote.change >= 0) : true;
  const formattedPrice = quote ? quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';
  const formattedChange = quote ? `${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)} (${quote.change >= 0 ? '+' : ''}${quote.pChange.toFixed(2)}%)` : '—';

  // SVG Line/Area Path calculation
  const getSvgPath = () => {
    if (!chartData || chartData.length === 0) return { linePath: '', areaPath: '', minVal: 0, maxVal: 0 };

    const prices = chartData.map(d => d.close);
    const minVal = Math.min(...prices);
    const maxVal = Math.max(...prices);
    const range = (maxVal - minVal) || 1;

    const width = 800;
    const height = 300;
    const padding = 20;

    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * (width - 2 * padding);
      const y = height - padding - ((d.close - minVal) / range) * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${(width - padding).toFixed(1)},${height - padding} L ${padding},${height - padding} Z`;

    return { linePath, areaPath, minVal, maxVal };
  };

  const { linePath, areaPath, minVal, maxVal } = getSvgPath();

  return (
    <section id="charts-section" className="bg-[#050505] text-white py-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">

        {/* Main Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#e5a93c] tracking-widest uppercase mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            INSTITUTIONAL SECTOR INTELLIGENCE
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            CHARTS & SECTOR WATCHLIST
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
            Track equities across core Indian market sectors with live quotes and high-precision line charting.
          </p>
        </div>

        {/* Chart Card */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 shadow-2xl relative">

          {/* Top Bar inside Chart */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#181818] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                INSTITUTIONAL CHARTING TERMINAL
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-black font-mono text-white tracking-wide">
                  {activeSymbol}
                </h3>
                <span className="text-2xl md:text-3xl font-black font-mono text-white">
                  ₹{formattedPrice}
                </span>
                <span className={`text-sm font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formattedChange}
                </span>
              </div>
            </div>

            {/* Controls: Chart Type Toggle & Timeframes */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Switch */}
              <div className="flex bg-[#111111] border border-[#222222] rounded-lg p-1 text-xs font-mono">
                <button
                  onClick={() => setChartType('AREA')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${chartType === 'AREA' ? 'bg-[#e5a93c] text-black shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  AREA
                </button>
                <button
                  onClick={() => setChartType('LINE')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${chartType === 'LINE' ? 'bg-[#e5a93c] text-black shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  LINE
                </button>
              </div>

              {/* Timeframe Switcher */}
              <div className="flex bg-[#111111] border border-[#222222] rounded-lg p-1 text-xs font-mono">
                {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${timeframe === tf ? 'bg-[#e5a93c] text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="relative h-72 md:h-96 w-full flex items-center justify-center bg-[#070707] rounded-xl border border-[#141414] overflow-hidden p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#e5a93c] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-mono text-gray-500">LOADING REAL-TIME CHART...</span>
              </div>
            ) : chartData.length > 0 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1="20"
                    y1={300 * ratio}
                    x2="780"
                    y2={300 * ratio}
                    stroke="#1a1a1a"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Area Fill */}
                {chartType === 'AREA' && (
                  <path d={areaPath} fill="url(#chartGradient)" />
                )}

                {/* Line Path */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Max & Min Markers */}
                <text x="770" y="25" fill="#666" fontSize="10" fontFamily="monospace" textAnchor="end">
                  HIGH: ₹{maxVal.toFixed(2)}
                </text>
                <text x="770" y="285" fill="#666" fontSize="10" fontFamily="monospace" textAnchor="end">
                  LOW: ₹{minVal.toFixed(2)}
                </text>
              </svg>
            ) : (
              <div className="text-gray-500 font-mono text-sm">NO CHART DATA AVAILABLE</div>
            )}
          </div>

          {/* Bottom Bar inside Chart */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#181818] pt-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label htmlFor="chart-asset-select" className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                CHANGE CHART ASSET:
              </label>
              <select
                id="chart-asset-select"
                value={activeSymbol}
                onChange={(e) => setActiveSymbol(e.target.value)}
                className="bg-[#111111] border border-[#2a2a2a] text-[#e5a93c] font-mono font-bold text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#e5a93c] cursor-pointer w-full md:w-64"
              >
                {allAvailableSymbols.map((sym) => (
                  <option key={sym} value={sym} className="bg-[#111111] text-white">
                    {sym}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs font-mono text-gray-500 text-center md:text-right">
              Centralized selection updates Options Chain & Sector Watchlist
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
