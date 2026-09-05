import React, { useState, useEffect } from 'react';
import { getIndices } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

export default function MarketOverviewSection() {
  const { setActiveSymbol, marketStatus } = useMarket();
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('15:30 IST');

  useEffect(() => {
    let isMounted = true;
    const fetchMarketIndices = async () => {
      try {
        const res = await getIndices();
        if (isMounted && res.success) {
          setIndices(res.data);
          if (res.timestamp) setLastUpdatedTime(res.timestamp);
        }
      } catch (e) {
        console.error('Error loading market indices:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarketIndices();
    // Only poll if market is open
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

  return (
    <section id="market-section" className="relative bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e5a93c] tracking-widest uppercase mb-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              REAL-TIME INTELLIGENCE
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              THE MARKET, IN REAL TIME.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Track the markets that matter with live data, precise price movement, sparklines and market intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-[#111111] border border-[#222222] px-3.5 py-1.5 rounded-md text-xs font-mono text-gray-300">
            <svg className="w-4 h-4 text-[#e5a93c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>UPDATED: {lastUpdatedTime}</span>
            <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          </div>
        </div>

        {/* Index Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 animate-pulse h-48">
                <div className="h-4 bg-[#1a1a1a] w-1/3 mb-4 rounded"></div>
                <div className="h-8 bg-[#1a1a1a] w-1/2 mb-6 rounded"></div>
                <div className="h-3 bg-[#1a1a1a] w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indices.map((idx) => {
              // Change & color based on change (non-negative is positive)
              const isPositive = idx.change >= 0;
              const formattedPrice = idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
              const formattedChange = (isPositive ? '+' : '') + idx.change.toFixed(2);
              const formattedPChange = (isPositive ? '+' : '') + idx.pChange.toFixed(2) + '%';

              return (
                <div
                  key={idx.symbol}
                  onClick={() => handleCardClick(idx.symbol)}
                  className="group relative bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#e5a93c]/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,169,60,0.1)] cursor-pointer"
                >
                  {/* Symbol & Name & % Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide font-mono group-hover:text-[#e5a93c] transition-colors">
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

                  {/* Main Price & Absolute Change */}
                  <div className="flex items-baseline justify-between mb-6">
                    <div className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formattedPrice}
                    </div>
                    <div className={`text-sm font-mono font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formattedChange}
                    </div>
                  </div>

                  {/* High / Low / Open Stats Footer */}
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
    </section>
  );
}
