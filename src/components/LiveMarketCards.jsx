import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, BarChart2, ShieldAlert } from 'lucide-react';
import { getIndices } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

export default function LiveMarketCards() {
  const [indices, setIndices] = useState([]);
  const [updatedTime, setUpdatedTime] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const { marketStatus, setActiveSymbol } = useMarket();

  useEffect(() => {
    async function loadData() {
      const res = await getIndices();
      if (res.success) {
        setIndices(res.data);
        setUpdatedTime(res.timestamp);
      }
    }
    loadData();

    // Refresh quotes periodically
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Card 3D Tilt helper logic
  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section id="markets" className="relative py-20 bg-[#070709] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Activity className="w-4 h-4" />
              <span>Real-Time Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              THE MARKET, IN REAL TIME.
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Track the markets that matter with live data, precise price movement, sparklines and market intelligence.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs font-mono text-gray-400 bg-neutral-900/90 px-4 py-2 rounded-lg border border-white/10">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>UPDATED: {marketStatus.istTime}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Live Market Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indices.map((item, idx) => {
            const isPos = item.change >= 0;
            return (
              <div
                key={item.symbol}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setActiveSymbol(item.symbol)}
                className="glass-card rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(217,119,6,0.15)] group relative overflow-hidden"
              >
                {/* Background Accent Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />

                {/* Card Top Row: Symbol & Name */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-mono tracking-wide group-hover:text-amber-400 transition-colors">
                      {item.symbol}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.name}</p>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1 ${
                      isPos ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPos ? '+' : ''}{item.pChange.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Main Price & Net Change */}
                <div className="mt-6 flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-mono font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{item.change.toFixed(2)}
                  </div>
                </div>

                {/* Mini Sparkline Visualization */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-gray-500 block">HIGH</span>
                      <span className="text-gray-200 font-semibold">{item.high.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">LOW</span>
                      <span className="text-gray-200 font-semibold">{item.low.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">OPEN</span>
                      <span className="text-gray-200 font-semibold">{item.open.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="mt-4 flex items-center justify-between text-xs text-amber-500/80 font-mono font-semibold pt-2">
                  <span>SELECT FOR TERMINAL</span>
                  <BarChart2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
