import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Layers, Activity } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { getHistoricalData, getQuote } from '../services/marketData';

export default function InteractiveMarketChart() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('candlestick'); // area, line, bar, candlestick
  const [chartData, setChartData] = useState([]);
  const [quoteInfo, setQuoteInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [histRes, quoteRes] = await Promise.all([
        getHistoricalData(activeSymbol, timeframe),
        getQuote(activeSymbol)
      ]);
      if (histRes.success) {
        setChartData(histRes.data);
      }
      if (quoteRes.success) {
        setQuoteInfo(quoteRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, [activeSymbol, timeframe]);

  const isPos = quoteInfo ? quoteInfo.change >= 0 : true;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">

      {/* Chart Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">

        {/* Symbol Dropdown Selector */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={activeSymbol}
              onChange={(e) => setActiveSymbol(e.target.value)}
              className="bg-neutral-900 text-white font-mono font-bold text-lg px-4 py-2 rounded-xl border border-amber-500/40 focus:outline-none focus:border-amber-400 cursor-pointer shadow-[0_0_15px_rgba(217,119,6,0.15)]"
            >
              {allAvailableSymbols.map((sym) => (
                <option key={sym} value={sym} className="bg-neutral-900 text-white">
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {quoteInfo && (
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-extrabold font-mono text-white">
                {quoteInfo.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? '+' : ''}{quoteInfo.change.toFixed(2)} ({isPos ? '+' : ''}{quoteInfo.pChange.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>

        {/* Timeframe & Display Mode Controls */}
        <div className="flex items-center space-x-3">

          {/* Timeframe selector */}
          <div className="flex items-center bg-neutral-900/90 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart type selector */}
          <div className="flex items-center bg-neutral-900/90 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'candlestick' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-gray-400'
              }`}
            >
              CANDLES
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'area' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-gray-400'
              }`}
            >
              AREA
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'line' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-gray-400'
              }`}
            >
              LINE
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'bar' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-gray-400'
              }`}
            >
              VOLUME
            </button>
          </div>

        </div>

      </div>

      {/* Main Chart Graphic Canvas */}
      <div className="h-[360px] w-full pt-6">
        {loading ? (
          <div className="h-full flex items-center justify-center text-amber-500 font-mono text-sm animate-pulse">
            LOADING CHART DATA...
          </div>
        ) : chartType === 'candlestick' ? (
          <div className="h-full w-full flex flex-col justify-end">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis domain={['auto', 'auto']} stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isUp = data.close >= data.open;
                      return (
                        <div className="bg-[#0a0a0c] border border-white/20 p-3 rounded-lg font-mono text-xs space-y-1">
                          <div className="font-bold text-amber-400">{data.date}</div>
                          <div className="grid grid-cols-2 gap-x-3 text-gray-300">
                            <span>Open: <strong className="text-white">₹{data.open}</strong></span>
                            <span>High: <strong className="text-emerald-400">₹{data.high}</strong></span>
                            <span>Low: <strong className="text-rose-400">₹{data.low}</strong></span>
                            <span>Close: <strong className={isUp ? 'text-emerald-400' : 'text-rose-400'}>₹{data.close}</strong></span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="close"
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    const isUp = payload.close >= payload.open;
                    const color = isUp ? '#22c55e' : '#ef4444';
                    return (
                      <g key={payload.date}>
                        <line
                          x1={x + width / 2}
                          y1={y - 4}
                          x2={x + width / 2}
                          y2={y + height + 4}
                          stroke={color}
                          strokeWidth={1.5}
                        />
                        <rect
                          x={x + 2}
                          y={y}
                          width={Math.max(width - 4, 3)}
                          height={Math.max(height, 2)}
                          fill={color}
                          rx={1}
                        />
                      </g>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPos ? "#22c55e" : "#ef4444"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isPos ? "#22c55e" : "#ef4444"} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis domain={['auto', 'auto']} stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
                />
                <Area type="monotone" dataKey="close" stroke={isPos ? "#22c55e" : "#ef4444"} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis domain={['auto', 'auto']} stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
                />
                <Line type="monotone" dataKey="close" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [Number(value).toLocaleString('en-IN'), 'Volume']}
                />
                <Bar dataKey="volume" fill="#d97706" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
