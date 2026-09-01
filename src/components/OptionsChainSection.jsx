import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Layers, BarChart2, Info, ArrowRight, Zap } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { getOptionsChain } from '../services/marketData';

export default function OptionsChainSection() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();

  // Index underlyings have weekly expiries; stock underlyings have monthly expiries
  const isIndex = ['NIFTY 50', 'BANK NIFTY', 'SENSEX', 'NIFTY IT', 'NIFTY FIN SERVICE', 'NIFTY MIDCAP 100'].includes(activeSymbol.toUpperCase());

  const indexExpiries = ['06-MAR-2025 (Weekly)', '13-MAR-2025 (Weekly)', '20-MAR-2025 (Weekly)', '27-MAR-2025 (Monthly)'];
  const stockExpiries = ['27-MAR-2025 (Monthly)', '24-APR-2025 (Monthly)', '29-MAY-2025 (Monthly)'];

  const expiries = isIndex ? indexExpiries : stockExpiries;
  const [expiry, setExpiry] = useState(expiries[0]);
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExpiry(expiries[0]);
  }, [activeSymbol]);

  useEffect(() => {
    async function loadChain() {
      setLoading(true);
      const res = await getOptionsChain(activeSymbol, expiry);
      if (res.success) {
        setChainData(res);
      }
      setLoading(false);
    }
    loadChain();
  }, [activeSymbol, expiry]);

  return (
    <section id="options" className="py-20 bg-[#060608] border-t border-white/10 relative overflow-hidden">

      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4" />
              <span>Options Intelligence & Terminal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              INSTITUTIONAL OPTIONS CHAIN
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-2xl">
              Live Open Interest (OI) analysis, Volatility Skew, PCR, Max Pain, and ATM Strike highlighted with 3D depth.
            </p>
          </div>

          {/* Asset & Expiry Selectors */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">

            {/* Symbol Dropdown */}
            <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <span className="text-[11px] font-mono text-gray-400">UNDERLYING:</span>
              <select
                value={activeSymbol}
                onChange={(e) => setActiveSymbol(e.target.value)}
                className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {allAvailableSymbols.map(sym => (
                  <option key={sym} value={sym} className="bg-neutral-900 text-white">{sym}</option>
                ))}
              </select>
            </div>

            {/* Expiry Selector */}
            <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] font-mono text-gray-400">EXPIRY:</span>
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {expiries.map(exp => (
                  <option key={exp} value={exp} className="bg-neutral-900 text-white">{exp}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Executive Options Summary Metric Cards */}
        {chainData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="glass-card rounded-xl p-4 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400 uppercase">SPOT PRICE</div>
              <div className="text-xl font-extrabold font-mono text-white mt-1">
                ₹{chainData.spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] font-mono text-amber-400 mt-0.5">UNDERLYING INDEX</div>
            </div>

            <div className="glass-card rounded-xl p-4 border border-amber-500/30 bg-amber-500/5">
              <div className="text-[11px] font-mono text-amber-300 uppercase">ATM STRIKE</div>
              <div className="text-xl font-extrabold font-mono text-amber-400 mt-1">
                {chainData.atmStrike}
              </div>
              <div className="text-[10px] font-mono text-amber-300/80 mt-0.5">CURRENT PIN LEVEL</div>
            </div>

            <div className="glass-card rounded-xl p-4 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400 uppercase">PCR (PUT / CALL RATIO)</div>
              <div className="text-xl font-extrabold font-mono text-emerald-400 mt-1">
                {chainData.pcr}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                {chainData.pcr > 1 ? 'BULLISH SENTIMENT' : 'BEARISH SENTIMENT'}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400 uppercase">MAX PAIN STRIKE</div>
              <div className="text-xl font-extrabold font-mono text-rose-400 mt-1">
                {chainData.maxPain}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">OPTION WRITER EXPIRY TARGET</div>
            </div>

          </div>
        )}

        {/* Options Chain Data Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-hidden shadow-2xl">

          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs font-mono">
            <div className="text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>CALL OPTIONS (CALLS)</span>
            </div>
            <div className="text-amber-400 font-bold tracking-widest uppercase">
              STRIKE PRICE
            </div>
            <div className="text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-2">
              <span>PUT OPTIONS (PUTS)</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-amber-400 font-mono text-sm animate-pulse">
              CALCULATING OPTION DERIVATIVES DATA & OI DISTRIBUTIONS...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10 text-[10px] uppercase">
                    {/* Calls */}
                    <th className="py-2 px-2 text-left">OI</th>
                    <th className="py-2 px-2">CHG OI</th>
                    <th className="py-2 px-2">VOL</th>
                    <th className="py-2 px-2">IV</th>
                    <th className="py-2 px-2">LTP</th>
                    <th className="py-2 px-2">BID / ASK</th>

                    {/* Strike */}
                    <th className="py-2 px-3 bg-neutral-900 text-amber-400 font-bold border-x border-white/10">
                      STRIKE
                    </th>

                    {/* Puts */}
                    <th className="py-2 px-2">BID / ASK</th>
                    <th className="py-2 px-2">LTP</th>
                    <th className="py-2 px-2">IV</th>
                    <th className="py-2 px-2">VOL</th>
                    <th className="py-2 px-2">CHG OI</th>
                    <th className="py-2 px-2 text-right">OI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {chainData?.strikes.map((row) => {
                    const isATM = row.isATM;
                    const maxCallOI = row.strike === chainData.maxCallOIStrike;
                    const maxPutOI = row.strike === chainData.maxPutOIStrike;

                    // OI Bar widths percentage
                    const callBarPct = Math.min(100, Math.round((row.calls.oi / 150000) * 100));
                    const putBarPct = Math.min(100, Math.round((row.puts.oi / 150000) * 100));

                    return (
                      <tr
                        key={row.strike}
                        className={`transition-colors ${
                          isATM
                            ? 'bg-amber-500/20 font-bold text-white border-y border-amber-500/50 shadow-[0_0_20px_rgba(217,119,6,0.2)]'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {/* Calls OI & Data */}
                        <td className="py-2.5 px-2 text-left relative">
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-emerald-500/15 z-0"
                            style={{ width: `${callBarPct}%` }}
                          />
                          <span className={`relative z-10 ${maxCallOI ? 'text-emerald-400 font-extrabold underline' : 'text-gray-300'}`}>
                            {row.calls.oi.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className={`py-2.5 px-2 ${row.calls.oiChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.calls.oiChange >= 0 ? '+' : ''}{row.calls.oiChange}
                        </td>
                        <td className="py-2.5 px-2 text-gray-400">{row.calls.volume.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-2 text-amber-300">{row.calls.iv}%</td>
                        <td className="py-2.5 px-2 font-bold text-white">₹{row.calls.ltp}</td>
                        <td className="py-2.5 px-2 text-[10px] text-gray-400">{row.calls.bid} / {row.calls.ask}</td>

                        {/* STRIKE CENTER COLUMN */}
                        <td
                          className={`py-2.5 px-3 font-extrabold text-sm border-x border-white/10 ${
                            isATM
                              ? 'bg-amber-500 text-black shadow-lg scale-105'
                              : 'bg-neutral-900 text-amber-400'
                          }`}
                        >
                          {row.strike}
                          {isATM && <span className="block text-[9px] text-black font-sans">ATM</span>}
                        </td>

                        {/* Puts Data & OI */}
                        <td className="py-2.5 px-2 text-[10px] text-gray-400">{row.puts.bid} / {row.puts.ask}</td>
                        <td className="py-2.5 px-2 font-bold text-white">₹{row.puts.ltp}</td>
                        <td className="py-2.5 px-2 text-amber-300">{row.puts.iv}%</td>
                        <td className="py-2.5 px-2 text-gray-400">{row.puts.volume.toLocaleString('en-IN')}</td>
                        <td className={`py-2.5 px-2 ${row.puts.oiChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.puts.oiChange >= 0 ? '+' : ''}{row.puts.oiChange}
                        </td>
                        <td className="py-2.5 px-2 text-right relative">
                          <div
                            className="absolute right-0 top-0 bottom-0 bg-rose-500/15 z-0"
                            style={{ width: `${putBarPct}%` }}
                          />
                          <span className={`relative z-10 ${maxPutOI ? 'text-rose-400 font-extrabold underline' : 'text-gray-300'}`}>
                            {row.puts.oi.toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
