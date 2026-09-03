import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';

export default function SectorWatchlistSection() {
  const { watchlistSectors, setActiveSymbol } = useMarket();
  const [activeTab, setActiveTab] = useState('Finance');
  const [searchTerm, setSearchTerm] = useState('');

  const currentSector = watchlistSectors.find(
    s => s.sectorName.toLowerCase() === activeTab.toLowerCase()
  ) || watchlistSectors[0];

  const filteredStocks = currentSector
    ? currentSector.stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleViewChart = (symbol) => {
    setActiveSymbol(symbol);
    const chartElem = document.getElementById('charts-section');
    if (chartElem) {
      chartElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="watchlist-section" className="bg-[#050505] text-white py-12 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">

        {/* Sector Tabs & Search Bar Container matching 3.png */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 shadow-xl">

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">

            {/* Sector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {watchlistSectors.map((sec) => {
                const isActive = sec.sectorName.toLowerCase() === activeTab.toLowerCase();
                return (
                  <button
                    key={sec.sectorName}
                    onClick={() => setActiveTab(sec.sectorName)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-[#e5a93c] text-black border-[#e5a93c] shadow-[0_0_15px_rgba(229,169,60,0.3)]'
                        : 'bg-[#111111] text-gray-300 border-[#222222] hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    {sec.sectorName} ({sec.stocks.length})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                placeholder="Search sector stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] text-xs font-mono text-white placeholder-gray-500 rounded-xl px-4 py-2.5 pl-9 focus:outline-none focus:border-[#e5a93c]"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-4 font-bold">SYMBOL / COMPANY</th>
                  <th className="py-3 px-4 text-right font-bold">LTP (₹)</th>
                  <th className="py-3 px-4 text-right font-bold">CHANGE (%)</th>
                  <th className="py-3 px-4 text-right font-bold">DAY HIGH</th>
                  <th className="py-3 px-4 text-right font-bold">DAY LOW</th>
                  <th className="py-3 px-4 text-right font-bold">VOLUME</th>
                  <th className="py-3 px-4 text-center font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414] font-mono text-xs">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => {
                    const isPos = stock.change >= 0;
                    const formattedLtp = stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    const formattedChg = `${isPos ? '+' : ''}${stock.change.toFixed(2)} (${isPos ? '+' : ''}${stock.pChange.toFixed(2)}%)`;

                    return (
                      <tr key={stock.symbol} className="hover:bg-[#111111] transition-colors group">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white group-hover:text-[#e5a93c] transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                            {stock.name}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          {formattedLtp}
                        </td>
                        <td className={`py-4 px-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formattedChg}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-300">
                          {stock.high ? stock.high.toLocaleString('en-IN') : '—'}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-300">
                          {stock.low ? stock.low.toLocaleString('en-IN') : '—'}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-400">
                          {stock.volume || '—'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleViewChart(stock.symbol)}
                            className="bg-[#181818] hover:bg-[#e5a93c] text-[#e5a93c] hover:text-black border border-[#e5a93c]/40 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all"
                          >
                            VIEW CHART
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500 font-mono text-xs">
                      No stocks found matching "{searchTerm}" in {activeTab}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </section>
  );
}
