import React, { useState, useEffect } from 'react';
import { getOptionsChain, getExpiryOptions } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

export default function OptionChainSection() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();

  // Calculate dynamic expiry options based on selected underlying symbol
  const availableExpiries = getExpiryOptions(activeSymbol);
  const [expiry, setExpiry] = useState(availableExpiries[0] || '');
  const [chain, setChain] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automatically adjust expiry if activeSymbol changes and current expiry is invalid
  useEffect(() => {
    const list = getExpiryOptions(activeSymbol);
    if (!list.includes(expiry)) {
      setExpiry(list[0] || '');
    }
  }, [activeSymbol]);

  useEffect(() => {
    let isMounted = true;
    const fetchChain = async () => {
      setLoading(true);
      try {
        const res = await getOptionsChain(activeSymbol, expiry);
        if (isMounted && res.success) {
          setChain(res);
        }
      } catch (err) {
        console.error('Error fetching options chain:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChain();
  }, [activeSymbol, expiry]);

  // Determine Max Call OI and Max Put OI for strength bar calculation & S/R labels
  const maxCallOI = chain?.strikes ? Math.max(...chain.strikes.map(s => s.calls.oi)) : 1;
  const maxPutOI = chain?.strikes ? Math.max(...chain.strikes.map(s => s.puts.oi)) : 1;

  const maxCallOIStrike = chain?.maxCallOIStrike ?? chain?.strikes?.find(s => s.calls.oi === maxCallOI)?.strike;
  const maxPutOIStrike = chain?.maxPutOIStrike ?? chain?.strikes?.find(s => s.puts.oi === maxPutOI)?.strike;

  return (
    <section id="options" className="bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e5a93c] tracking-widest uppercase mb-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              OPTIONS INTELLIGENCE & TERMINAL
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              INSTITUTIONAL OPTIONS CHAIN
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Live Open Interest (OI) analysis, Volatility Skew, PCR, Max Pain, and ATM Strike highlighted with 3D depth and Support/Resistance strength indicators.
            </p>
          </div>

          {/* Underlyings & Expiry Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-gray-400 font-bold uppercase">UNDERLYING:</span>
              <select
                value={activeSymbol}
                onChange={(e) => setActiveSymbol(e.target.value)}
                className="bg-transparent text-[#e5a93c] font-bold focus:outline-none cursor-pointer"
              >
                {allAvailableSymbols.map((sym) => (
                  <option key={sym} value={sym} className="bg-[#111111] text-white">
                    {sym}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-gray-400 font-bold uppercase">EXPIRY:</span>
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {availableExpiries.map((expOption) => (
                  <option key={expOption} value={expOption} className="bg-[#111111] text-white">
                    {expOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top Summary Cards (Spot Price, ATM, PCR, Max Pain, Strong S/R) */}
        {chain && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">SPOT PRICE</div>
              <div className="text-2xl font-black text-white">₹{chain.spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div className="text-[10px] text-[#e5a93c] font-bold mt-1">UNDERLYING INDEX / ASSET</div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">ATM STRIKE</div>
              <div className="text-2xl font-black text-[#e5a93c]">{chain.atmStrike}</div>
              <div className="text-[10px] text-gray-400 mt-1">CURRENT PIN LEVEL</div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">PCR (PUT / CALL RATIO)</div>
              <div className={`text-2xl font-black ${chain.pcr >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>{chain.pcr}</div>
              <div className="text-[10px] text-emerald-400 mt-1">{chain.pcr >= 1 ? 'BULLISH SENTIMENT' : 'BEARISH SENTIMENT'}</div>
            </div>

            <div className="bg-[#0a0a0a] border border-emerald-900/40 rounded-xl p-4 font-mono bg-emerald-950/10">
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> STRONG SUPPORT
              </div>
              <div className="text-2xl font-black text-emerald-400">{maxPutOIStrike}</div>
              <div className="text-[10px] text-gray-400 mt-1">MAX PUT OI CONCENTRATION</div>
            </div>

            <div className="bg-[#0a0a0a] border border-red-900/40 rounded-xl p-4 font-mono bg-red-950/10 col-span-2 md:col-span-1">
              <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> STRONG RESISTANCE
              </div>
              <div className="text-2xl font-black text-red-400">{maxCallOIStrike}</div>
              <div className="text-[10px] text-gray-400 mt-1">MAX CALL OI CONCENTRATION</div>
            </div>
          </div>
        )}

        {/* Options Chain Table */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-4 md:p-6 shadow-2xl overflow-x-auto">

          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3 mb-4 font-mono text-xs font-bold min-w-[950px]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> CALL OPTIONS (CALLS) - RESISTANCE
            </span>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-1.5 rounded bg-red-500/80"></span> CALL OI STRENGTH
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-1.5 rounded bg-emerald-500/80"></span> PUT OI STRENGTH
              </span>
            </div>
            <span className="text-red-400 flex items-center gap-1.5">
              PUT OPTIONS (PUTS) - SUPPORT <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 font-mono text-xs">
              LOADING OPTIONS CHAIN DATA...
            </div>
          ) : (
            <table className="w-full border-collapse text-xs font-mono min-w-[950px]">
              <thead>
                <tr className="text-gray-400 text-[11px] border-b border-[#181818] pb-2">
                  <th className="py-2 text-left font-semibold w-28">CALL OI (STRENGTH)</th>
                  <th className="py-2 text-right font-semibold">CHG OI</th>
                  <th className="py-2 text-right font-semibold">VOL</th>
                  <th className="py-2 text-right font-semibold">IV</th>
                  <th className="py-2 text-right font-semibold">LTP</th>
                  <th className="py-2 text-right font-semibold">BID / ASK</th>
                  <th className="py-2 text-center text-[#e5a93c] font-bold">STRIKE</th>
                  <th className="py-2 text-left font-semibold">BID / ASK</th>
                  <th className="py-2 text-left font-semibold">LTP</th>
                  <th className="py-2 text-left font-semibold">IV</th>
                  <th className="py-2 text-left font-semibold">VOL</th>
                  <th className="py-2 text-left font-semibold">CHG OI</th>
                  <th className="py-2 text-right font-semibold w-28">PUT OI (STRENGTH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {chain?.strikes?.map((row) => {
                  const isAtm = row.isATM;
                  const isMaxCallOI = row.strike === maxCallOIStrike;
                  const isMaxPutOI = row.strike === maxPutOIStrike;

                  const callOIBarWidth = Math.min(100, Math.max(5, (row.calls.oi / maxCallOI) * 100));
                  const putOIBarWidth = Math.min(100, Math.max(5, (row.puts.oi / maxPutOI) * 100));

                  return (
                    <tr
                      key={row.strike}
                      className={`transition-colors ${
                        isAtm
                          ? 'bg-[#e5a93c]/20 border-y border-[#e5a93c]/60 font-bold text-white'
                          : isMaxCallOI
                          ? 'bg-red-950/20 hover:bg-red-950/30'
                          : isMaxPutOI
                          ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                          : 'hover:bg-[#111111]'
                      }`}
                    >
                      {/* CALLS OI with red bar */}
                      <td className="py-2.5 text-left font-semibold">
                        <div className="text-red-400 font-bold flex items-center justify-between">
                          <span>{row.calls.oi.toLocaleString('en-IN')}</span>
                          {isMaxCallOI && (
                            <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/40 px-1 py-0.2 rounded font-extrabold uppercase">
                              STRONG RES
                            </span>
                          )}
                        </div>
                        {/* Red Call OI Strength Bar */}
                        <div className="w-full bg-[#181818] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isMaxCallOI ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-500/70'}`}
                            style={{ width: `${callOIBarWidth}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className={`py-2.5 text-right font-medium ${row.calls.oiChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.calls.oiChange >= 0 ? '+' : ''}{row.calls.oiChange.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-right text-gray-300">{row.calls.volume.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right text-gray-400">{row.calls.iv}%</td>
                      <td className="py-2.5 text-right text-white font-bold">₹{row.calls.ltp.toFixed(2)}</td>
                      <td className="py-2.5 text-right text-gray-400 text-[11px]">{row.calls.bid} / {row.calls.ask}</td>

                      {/* STRIKE CENTER */}
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md font-extrabold ${
                          isAtm
                            ? 'bg-[#e5a93c] text-black shadow-[0_0_10px_rgba(229,169,60,0.5)]'
                            : isMaxCallOI
                            ? 'bg-red-500 text-white border border-red-400'
                            : isMaxPutOI
                            ? 'bg-emerald-500 text-black border border-emerald-400'
                            : 'bg-[#181818] text-[#e5a93c] border border-[#262626]'
                        }`}>
                          {row.strike}
                          {isAtm && <span className="block text-[8px] tracking-tighter uppercase font-black text-black">ATM</span>}
                          {!isAtm && isMaxCallOI && <span className="block text-[7px] tracking-tighter uppercase font-black text-white">MAX CALL OI</span>}
                          {!isAtm && isMaxPutOI && <span className="block text-[7px] tracking-tighter uppercase font-black text-black">MAX PUT OI</span>}
                        </span>
                      </td>

                      {/* PUTS */}
                      <td className="py-2.5 text-left text-gray-400 text-[11px]">{row.puts.bid} / {row.puts.ask}</td>
                      <td className="py-2.5 text-left text-white font-bold">₹{row.puts.ltp.toFixed(2)}</td>
                      <td className="py-2.5 text-left text-gray-400">{row.puts.iv}%</td>
                      <td className="py-2.5 text-left text-gray-300">{row.puts.volume.toLocaleString('en-IN')}</td>
                      <td className={`py-2.5 text-left font-medium ${row.puts.oiChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.puts.oiChange >= 0 ? '+' : ''}{row.puts.oiChange.toLocaleString('en-IN')}
                      </td>

                      {/* PUTS OI with green bar */}
                      <td className="py-2.5 text-right font-semibold">
                        <div className="text-emerald-400 font-bold flex items-center justify-between">
                          {isMaxPutOI && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1 py-0.2 rounded font-extrabold uppercase">
                              STRONG SUPP
                            </span>
                          )}
                          <span className="ml-auto">{row.puts.oi.toLocaleString('en-IN')}</span>
                        </div>
                        {/* Green Put OI Strength Bar */}
                        <div className="w-full bg-[#181818] h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ml-auto ${isMaxPutOI ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-emerald-500/70'}`}
                            style={{ width: `${putOIBarWidth}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </section>
  );
}
