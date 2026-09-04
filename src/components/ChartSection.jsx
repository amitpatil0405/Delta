import React, { useState, useEffect } from 'react';
import { getHistoricalData, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

export default function ChartSection() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();
  const [chartData, setChartData] = useState([]);
  const [quote, setQuote] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('AREA'); // 'AREA', 'LINE', 'CANDLE', 'BAR'
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

  // Compare price against opening price
  const isPositive = quote ? (quote.price >= (quote.open ?? quote.price)) : true;
  const formattedPrice = quote ? quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';
  const formattedChange = quote ? `${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)} (${quote.change >= 0 ? '+' : ''}${quote.pChange.toFixed(2)}%)` : '—';

  // SVG Chart Calculations
  const getChartCalculations = () => {
    if (!chartData || chartData.length === 0) {
      return { linePath: '', areaPath: '', minVal: 0, maxVal: 0, priceTicks: [], timeTicks: [], formattedData: [] };
    }

    const pricesLow = chartData.map(d => d.low ?? d.close);
    const pricesHigh = chartData.map(d => d.high ?? d.close);
    const minVal = Math.min(...pricesLow);
    const maxVal = Math.max(...pricesHigh);
    const range = (maxVal - minVal) || 1;

    const width = 800;
    const height = 300;
    const padTop = 20;
    const padBottom = 30; // Space for X-axis time labels
    const padLeft = 20;
    const padRight = 75; // Space for Y-axis price labels on the right

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const formattedData = chartData.map((d, i) => {
      const x = padLeft + (i / Math.max(1, chartData.length - 1)) * chartW;
      const yClose = padTop + chartH - ((d.close - minVal) / range) * chartH;
      const yOpen = padTop + chartH - ((d.open - minVal) / range) * chartH;
      const yHigh = padTop + chartH - ((d.high - minVal) / range) * chartH;
      const yLow = padTop + chartH - ((d.low - minVal) / range) * chartH;
      return { ...d, x, yClose, yOpen, yHigh, yLow };
    });

    // Line and Area Paths
    const points = formattedData.map(d => `${d.x.toFixed(1)},${d.yClose.toFixed(1)}`);
    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${(padLeft + chartW).toFixed(1)},${padTop + chartH} L ${padLeft.toFixed(1)},${padTop + chartH} Z`;

    // Price Ticks for Y-Axis (Right Side)
    const tickCount = 5;
    const priceTicks = [];
    for (let i = 0; i < tickCount; i++) {
      const ratio = i / (tickCount - 1);
      const val = maxVal - ratio * range;
      const y = padTop + ratio * chartH;
      priceTicks.push({ val, y });
    }

    // Time Ticks for X-Axis (Bottom)
    const step = Math.max(1, Math.floor(chartData.length / 5));
    const timeTicks = [];
    for (let i = 0; i < chartData.length; i += step) {
      timeTicks.push(formattedData[i]);
    }
    // Ensure last point is included if not present
    if (timeTicks[timeTicks.length - 1] !== formattedData[formattedData.length - 1]) {
      timeTicks.push(formattedData[formattedData.length - 1]);
    }

    return {
      linePath,
      areaPath,
      minVal,
      maxVal,
      priceTicks,
      timeTicks,
      formattedData,
      padLeft,
      padRight,
      padTop,
      padBottom,
      width,
      height,
      chartW,
      chartH
    };
  };

  const calc = getChartCalculations();

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

          {/* Top Info Header */}
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

            {/* Top Bar Controls: Asset Selector BEFORE Chart Types & Timeframes */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Asset Dropdown */}
              <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-lg px-3 py-1.5">
                <label htmlFor="chart-asset-select-top" className="text-xs font-mono text-[#e5a93c] font-bold uppercase tracking-wider whitespace-nowrap">
                  ASSET:
                </label>
                <select
                  id="chart-asset-select-top"
                  value={activeSymbol}
                  onChange={(e) => setActiveSymbol(e.target.value)}
                  className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {allAvailableSymbols.map((sym) => (
                    <option key={sym} value={sym} className="bg-[#111111] text-white">
                      {sym}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chart Type Toggle */}
              <div className="flex bg-[#111111] border border-[#222222] rounded-lg p-1 text-xs font-mono">
                {[
                  { id: 'AREA', label: 'AREA' },
                  { id: 'LINE', label: 'LINE' },
                  { id: 'CANDLE', label: 'CANDLE' },
                  { id: 'BAR', label: 'BAR' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${chartType === type.id ? 'bg-[#e5a93c] text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Timeframe Switcher */}
              <div className="flex bg-[#111111] border border-[#222222] rounded-lg p-1 text-xs font-mono">
                {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${timeframe === tf ? 'bg-[#e5a93c] text-black shadow' : 'text-gray-400 hover:text-white'}`}
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
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${calc.width} ${calc.height}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines & Y-Axis Ticks (Right Side) */}
                {calc.priceTicks.map((pt, idx) => (
                  <g key={idx}>
                    <line
                      x1={calc.padLeft}
                      y1={pt.y}
                      x2={calc.width - calc.padRight}
                      y2={pt.y}
                      stroke="#1a1a1a"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    {/* Y-Axis Price Label (Right Vertical Axis) */}
                    <text
                      x={calc.width - calc.padRight + 8}
                      y={pt.y + 3}
                      fill="#888888"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="start"
                    >
                      ₹{pt.val.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </text>
                  </g>
                ))}

                {/* X-Axis Ticks & Date/Time Labels (Bottom Horizontal Axis) */}
                {calc.timeTicks.map((tt, idx) => (
                  <g key={idx}>
                    <line
                      x1={tt.x}
                      y1={calc.padTop}
                      x2={tt.x}
                      y2={calc.height - calc.padBottom}
                      stroke="#141414"
                      strokeWidth="1"
                    />
                    <text
                      x={tt.x}
                      y={calc.height - 10}
                      fill="#777777"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {tt.date}
                    </text>
                  </g>
                ))}

                {/* Chart Rendering based on Chart Type */}
                {chartType === 'AREA' && (
                  <>
                    <path d={calc.areaPath} fill="url(#chartGradient)" />
                    <path
                      d={calc.linePath}
                      fill="none"
                      stroke={isPositive ? '#10b981' : '#ef4444'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {chartType === 'LINE' && (
                  <path
                    d={calc.linePath}
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {chartType === 'CANDLE' && calc.formattedData.map((d, i) => {
                  const isBullish = d.close >= d.open;
                  const color = isBullish ? '#10b981' : '#ef4444';
                  const candleWidth = Math.max(2, Math.min(10, (calc.chartW / calc.formattedData.length) * 0.6));
                  const topY = Math.min(d.yOpen, d.yClose);
                  const bodyH = Math.max(2, Math.abs(d.yOpen - d.yClose));

                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={d.x}
                        y1={d.yHigh}
                        x2={d.x}
                        y2={d.yLow}
                        stroke={color}
                        strokeWidth="1.2"
                      />
                      {/* Body */}
                      <rect
                        x={d.x - candleWidth / 2}
                        y={topY}
                        width={candleWidth}
                        height={bodyH}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}

                {chartType === 'BAR' && calc.formattedData.map((d, i) => {
                  const isBullish = d.close >= d.open;
                  const color = isBullish ? '#10b981' : '#ef4444';
                  const barTickWidth = Math.max(3, Math.min(6, (calc.chartW / calc.formattedData.length) * 0.4));

                  return (
                    <g key={i}>
                      {/* Vertical High-Low Bar */}
                      <line
                        x1={d.x}
                        y1={d.yHigh}
                        x2={d.x}
                        y2={d.yLow}
                        stroke={color}
                        strokeWidth="1.8"
                      />
                      {/* Left Open Tick */}
                      <line
                        x1={d.x - barTickWidth}
                        y1={d.yOpen}
                        x2={d.x}
                        y2={d.yOpen}
                        stroke={color}
                        strokeWidth="1.8"
                      />
                      {/* Right Close Tick */}
                      <line
                        x1={d.x}
                        y1={d.yClose}
                        x2={d.x + barTickWidth}
                        y2={d.yClose}
                        stroke={color}
                        strokeWidth="1.8"
                      />
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="text-gray-500 font-mono text-sm">NO CHART DATA AVAILABLE</div>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#181818] pt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="text-[#e5a93c] font-bold">●</span> Centralized asset selection synchronizes Chart, Watchlist, & Option Chain
            </div>
            <p className="text-xs font-mono text-gray-500">
              X-Axis: Time / Date | Y-Axis: Price (₹)
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
