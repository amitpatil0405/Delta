import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getHistoricalData, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';
import { TrendingUp, TrendingDown, RefreshCw, ZoomIn, ZoomOut, RotateCcw, CandlestickChart, LineChart } from 'lucide-react';

export default function InteractiveMarketChart() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' or 'line'
  const [zoomLevel, setZoomLevel] = useState(1);
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

  // Zoom slice calculation
  const displayedData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    if (zoomLevel === 1) return chartData;
    const sliceCount = Math.max(5, Math.floor(chartData.length / zoomLevel));
    return chartData.slice(-sliceCount);
  }, [chartData, zoomLevel]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-500/30 shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden">

      {/* Control Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
              INSTITUTIONAL CHARTING TERMINAL
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
          {/* Chart Type Toggle */}
          <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setChartType('candlestick')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                chartType === 'candlestick' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Candlestick View"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              <span>CANDLES</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                chartType === 'line' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Area Line View"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>AREA</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-neutral-900 rounded-lg p-1 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 4))}
              className="p-1.5 hover:bg-white/10 text-gray-300 rounded hover:text-amber-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
              className="p-1.5 hover:bg-white/10 text-gray-300 rounded hover:text-amber-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-white/10 text-gray-300 rounded hover:text-amber-400"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

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
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="h-[440px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center space-x-2 text-amber-400 text-sm font-mono">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Live Yahoo Finance Chart Data...</span>
          </div>
        )}

        {chartType === 'candlestick' ? (
          /* Institutional TradingView-Style Candlestick Chart Engine */
          <div className="w-full h-full relative font-mono select-none">
            {displayedData.length > 0 && (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="none">
                {(() => {
                  const padding = { top: 20, right: 85, bottom: 35, left: 10 };
                  const width = 1000 - padding.left - padding.right;
                  const height = 400 - padding.top - padding.bottom;

                  // High/Low Bounds Calculation
                  const highs = displayedData.map(d => d.high);
                  const lows = displayedData.map(d => d.low);
                  const maxPrice = Math.max(...highs) * 1.002;
                  const minPrice = Math.min(...lows) * 0.998;
                  const priceRange = maxPrice - minPrice || 1;

                  const priceToY = (price) =>
                    padding.top + (1 - (price - minPrice) / priceRange) * height;

                  // Y-Axis Price Ticks (Right Side)
                  const tickCount = 6;
                  const priceTicks = Array.from({ length: tickCount }, (_, i) => {
                    return minPrice + (i / (tickCount - 1)) * priceRange;
                  });

                  // X-Axis Date Ticks (Bottom Side)
                  const step = Math.max(1, Math.floor(displayedData.length / 6));
                  const xTicks = displayedData.filter((_, idx) => idx % step === 0);

                  const candleWidth = Math.max(4, Math.min(16, (width / displayedData.length) * 0.65));
                  const lastCandle = displayedData[displayedData.length - 1];
                  const currentPriceY = priceToY(lastCandle.close);

                  return (
                    <g>
                      {/* Horizontal Gridlines & Right Y-Axis Labels */}
                      {priceTicks.map((p, idx) => {
                        const y = priceToY(p);
                        return (
                          <g key={`yTick-${idx}`}>
                            <line
                              x1={padding.left}
                              y1={y}
                              x2={1000 - padding.right}
                              y2={y}
                              stroke="rgba(255, 255, 255, 0.07)"
                              strokeDasharray="3 3"
                            />
                            <text
                              x={1000 - padding.right + 8}
                              y={y + 4}
                              fill="#9ca3af"
                              fontSize="11"
                              fontFamily="monospace"
                            >
                              {p.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </text>
                          </g>
                        );
                      })}

                      {/* Vertical Gridlines & Bottom X-Axis Date/Time Labels */}
                      {xTicks.map((d, idx) => {
                        const dataIndex = displayedData.indexOf(d);
                        const x = padding.left + (dataIndex + 0.5) * (width / displayedData.length);
                        return (
                          <g key={`xTick-${idx}`}>
                            <line
                              x1={x}
                              y1={padding.top}
                              x2={x}
                              y2={400 - padding.bottom}
                              stroke="rgba(255, 255, 255, 0.05)"
                            />
                            <text
                              x={x}
                              y={400 - padding.bottom + 20}
                              fill="#6b7280"
                              fontSize="11"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {d.date}
                            </text>
                          </g>
                        );
                      })}

                      {/* Live Market Price Horizontal Dotted Line & Badge */}
                      <line
                        x1={padding.left}
                        y1={currentPriceY}
                        x2={1000 - padding.right}
                        y2={currentPriceY}
                        stroke="#22d3ee"
                        strokeDasharray="2 2"
                        strokeWidth="1.5"
                      />
                      <rect
                        x={1000 - padding.right + 2}
                        y={currentPriceY - 11}
                        width="80"
                        height="22"
                        rx="4"
                        fill="#0891b2"
                      />
                      <text
                        x={1000 - padding.right + 42}
                        y={currentPriceY + 4}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {lastCandle.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </text>

                      {/* Render Candlesticks (Wicks + Bodies) */}
                      {displayedData.map((d, i) => {
                        const x = padding.left + (i + 0.5) * (width / displayedData.length);
                        const isBull = d.close >= d.open;
                        const candleColor = isBull ? '#10b981' : '#f43f5e';

                        const yHigh = priceToY(d.high);
                        const yLow = priceToY(d.low);
                        const yOpen = priceToY(d.open);
                        const yClose = priceToY(d.close);

                        const yBodyTop = Math.min(yOpen, yClose);
                        const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));

                        return (
                          <g key={`candle-${i}`} className="cursor-pointer group">
                            {/* High-Low Wick Line */}
                            <line
                              x1={x}
                              y1={yHigh}
                              x2={x}
                              y2={yLow}
                              stroke={candleColor}
                              strokeWidth="1.5"
                            />
                            {/* Open-Close Body Rect */}
                            <rect
                              x={x - candleWidth / 2}
                              y={yBodyTop}
                              width={candleWidth}
                              height={bodyHeight}
                              fill={candleColor}
                              rx="1"
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}
              </svg>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
        )}
      </div>

      {/* Direct Dropdown Option Selector directly below chart */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-gray-400 font-semibold">CHANGE CHART ASSET:</span>
          <select
            value={activeSymbol}
            onChange={(e) => setActiveSymbol(e.target.value)}
            className="bg-neutral-900 text-amber-400 border border-amber-500/40 rounded-xl px-4 py-2 font-mono font-bold text-xs focus:outline-none focus:border-amber-400 cursor-pointer shadow-lg"
          >
            {allAvailableSymbols.map((sym) => (
              <option key={sym} value={sym} className="bg-neutral-900 text-white">
                {sym}
              </option>
            ))}
          </select>
        </div>
        <div className="text-[11px] font-mono text-gray-500 hidden sm:block">
          Centralized selection updates Options Chain & Sector Watchlist
        </div>
      </div>

    </div>
  );
}
