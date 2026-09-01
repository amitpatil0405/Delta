import React, { useState } from 'react';
import { Plus, Trash2, Search, Filter, ShieldCheck, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import InteractiveMarketChart from './InteractiveMarketChart';

export default function StockWatchlistSection() {
  const {
    watchlistSectors,
    addStockToWatchlist,
    removeStockFromWatchlist,
    activeSymbol,
    setActiveSymbol
  } = useMarket();

  const [selectedSector, setSelectedSector] = useState(watchlistSectors[0]?.sectorName || 'Indices');
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [newSectorName, setNewSectorName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newStockSymbol) return;

    const sectorToUse = newSectorName.trim() || selectedSector;
    const success = await addStockToWatchlist(sectorToUse, newStockSymbol);
    if (success) {
      setNewStockSymbol('');
      setNewSectorName('');
      setIsAdding(false);
      setSelectedSector(sectorToUse);
    }
  };

  const currentSectorObj = watchlistSectors.find(
    s => s.sectorName.toLowerCase() === selectedSector.toLowerCase()
  ) || watchlistSectors[0];

  const filteredStocks = (currentSectorObj?.stocks || []).filter(stock =>
    stock.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section className="py-16 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Eye className="w-4 h-4" />
              <span>Centralized Terminal & Watchlist</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CHARTS & SECTOR WATCHLIST
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Manage your stock portfolio sector-wise. Adding a symbol updates the interactive chart, options chain, and watchlist instantly.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl hover:bg-amber-500/30 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'CLOSE ADMIN FORM' : 'ADD STOCK / SECTOR'}</span>
          </button>
        </div>

        {/* Interactive Main Chart */}
        <InteractiveMarketChart />

        {/* Watchlist Section */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">

          {/* Admin Stock Addition Drawer */}
          {isAdding && (
            <form onSubmit={handleAddStock} className="mb-6 p-4 rounded-xl bg-neutral-900/90 border border-amber-500/30 space-y-4">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Admin Control — Add Symbol To Central Watchlist & Terminal
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">STOCK SYMBOL (e.g. RELIANCE, TCS)</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER SYMBOL"
                    value={newStockSymbol}
                    onChange={(e) => setNewStockSymbol(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">SECTOR NAME (OR SELECT EXISTING)</label>
                  <input
                    type="text"
                    placeholder={`e.g. ${selectedSector}`}
                    value={newSectorName}
                    onChange={(e) => setNewSectorName(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs py-2 px-4 rounded-lg transition-all uppercase"
                  >
                    CONFIRM & ADD SYMBOL
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sector Tabs Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {watchlistSectors.map((sec) => (
                <button
                  key={sec.sectorName}
                  onClick={() => setSelectedSector(sec.sectorName)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    selectedSector.toLowerCase() === sec.sectorName.toLowerCase()
                      ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                      : 'bg-neutral-900/80 text-gray-300 hover:text-white border border-white/5'
                  }`}
                >
                  {sec.sectorName} ({sec.stocks.length})
                </button>
              ))}
            </div>

            {/* Search Filter */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-white/10 text-[11px] uppercase">
                  <th className="py-3 px-4">Symbol / Company</th>
                  <th className="py-3 px-4 text-right">LTP (₹)</th>
                  <th className="py-3 px-4 text-right">Change (%)</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Day High</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">Day Low</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStocks.map((stock) => {
                  const isPos = stock.change >= 0;
                  const isSelected = activeSymbol === stock.symbol;

                  return (
                    <tr
                      key={stock.symbol}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-500/10' : ''
                      }`}
                      onClick={() => setActiveSymbol(stock.symbol)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white text-sm flex items-center space-x-2">
                          <span>{stock.symbol}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-sans">{stock.name}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white text-sm">
                        {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}{stock.change.toFixed(2)} ({isPos ? '+' : ''}{stock.pChange.toFixed(2)}%)
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-300 hidden sm:table-cell">
                        {stock.high ? stock.high.toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-300 hidden sm:table-cell">
                        {stock.low ? stock.low.toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-400 hidden md:table-cell">
                        {stock.volume || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveSymbol(stock.symbol)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg hover:bg-amber-500 hover:text-black transition-all"
                          >
                            VIEW
                          </button>
                          <button
                            onClick={() => removeStockFromWatchlist(selectedSector, stock.symbol)}
                            className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                            title="Remove Stock"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </section>
  );
}
