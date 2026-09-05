import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BookOpen } from 'lucide-react';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=0';
const STORAGE_KEY = 'deltafox_portfolio_trades_v4';

// Helper function to parse CSV lines safely matching Google Sheet headers:
// "DATE","DAY","SYMBOL","STRATEGY","EXPIRY","QUANTITY","PROBABILITY OF PROFIT","STATUS","P&L","TRADE CLOSE DATE","HOLD TIME ( DAYS )"
function parseCSVRows(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const parsedTrades = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = [];
    let cur = '';
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    cols.push(cur.trim());

    if (cols.length >= 8) {
      const date = cols[0] || '';
      const day = cols[1] || '';
      const symbol = (cols[2] || '').toUpperCase();
      const strategy = cols[3] || 'Short Strangle';
      const expiry = cols[4] || date;
      const qty = parseInt(cols[5], 10) || 0;

      // Clean Probability of Profit string e.g. "70.0%" -> 70.0
      let popRaw = (cols[6] || '70.0').replace(/%/g, '').trim();
      const pop = parseFloat(popRaw) || 70.0;

      const status = (cols[7] || 'OPEN').toUpperCase();

      // Clean P&L string e.g. "₹-2,100" / "+₹3,358.75" -> -2100 / 3358.75
      let pnlRaw = (cols[8] || '0').replace(/[^\d.-]/g, '');
      const manualPnl = parseFloat(pnlRaw) || 0;

      const tradeCloseDate = cols[9] || '-';

      // Clean Hold time in days string e.g. "7 Days" or "7"
      let holdRaw = (cols[10] || '-').replace(/\D/g, '');
      const holdTime = holdRaw ? parseInt(holdRaw, 10) : '-';

      if (symbol) {
        parsedTrades.push({
          id: `sheet_${i}_${symbol}`,
          date,
          day,
          symbol,
          strategy,
          expiry,
          qty,
          pop,
          status,
          manualPnl,
          tradeCloseDate,
          holdTime
        });
      }
    }
  }

  return parsedTrades;
}

export default function PortfolioJournalSection() {
  // Trades state initialized from local cache (Fallback)
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored trades:', e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch Global Trades on mount & Periodic Sync (every 10s) from Google Sheet CSV
  useEffect(() => {
    const fetchSheetTrades = async () => {
      try {
        const sheetUrlWithTimestamp = `${GOOGLE_SHEET_CSV_URL}&_t=${Date.now()}`;
        const sheetRes = await fetch(sheetUrlWithTimestamp, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (sheetRes.ok) {
          const csvText = await sheetRes.text();
          const parsedSheetTrades = parseCSVRows(csvText);
          if (parsedSheetTrades.length > 0) {
            setTrades(parsedSheetTrades);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedSheetTrades));
          }
        }
      } catch (e) {
        console.warn('Google Sheet CSV fetch notice:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetTrades();
    const interval = setInterval(fetchSheetTrades, 10000);
    return () => clearInterval(interval);
  }, []);

  // Key Portfolio Metrics
  const isTradeClosed = (t) => t.status === 'CLOSED PROFIT' || t.status === 'CLOSED LOSS' || t.status === 'CLOSED';
  const closedTrades = trades.filter(isTradeClosed);
  const winningTrades = closedTrades.filter(t => t.manualPnl > 0 || t.status === 'CLOSED PROFIT');
  const losingTrades = closedTrades.filter(t => t.manualPnl < 0 || t.status === 'CLOSED LOSS');

  const totalTradesCount = trades.length;
  const winRate = closedTrades.length > 0 ? ((winningTrades.length / closedTrades.length) * 100).toFixed(1) : '0.0';
  const totalPnl = closedTrades.reduce((acc, t) => acc + t.manualPnl, 0);

  const avgProfit = winningTrades.length > 0
    ? (winningTrades.reduce((acc, t) => acc + t.manualPnl, 0) / winningTrades.length).toFixed(0)
    : 0;

  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((acc, t) => acc + t.manualPnl, 0) / losingTrades.length).toFixed(0)
    : 0;

  // Cumulative P&L curve dataset
  let runningPnl = 0;
  const pnlCurveData = closedTrades.slice().reverse().map((t, idx) => {
    runningPnl += t.manualPnl;
    return {
      trade: `Trade ${idx + 1}`,
      pnl: runningPnl,
      tradePnl: t.manualPnl
    };
  });

  return (
    <section id="portfolio" className="pt-16 pb-16 scroll-mt-20 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Institutional Trading Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              PORTFOLIO & TRADING JOURNAL
            </h2>
            <p className="mt-1.5 text-sm text-gray-400 max-w-xl">
              Track trade execution, entry/exit prices, financial year performance, and disciplined P&L analytics directly synced from Google Sheets.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE SYNCED WITH GOOGLE SHEET</span>
          </div>
        </div>

        {/* Portfolio Performance Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">TOTAL TRADES</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{totalTradesCount}</div>
            <span className="text-[10px] font-mono text-amber-400">{closedTrades.length} Closed / {trades.length - closedTrades.length} Open</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">WIN RATE</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">{winRate}%</div>
            <span className="text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">{winningTrades.length} Wins</span>
              <span className="text-gray-400"> / </span>
              <span className="text-rose-400 font-bold">{losingTrades.length} Losses</span>
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">NET CUMULATIVE P&L</span>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-mono text-gray-400">Current FY Statement</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">AVG PROFIT / LOSS</span>
            <div className="text-xl font-extrabold font-mono mt-1 flex items-center space-x-1">
              <span className="text-emerald-400">+₹{avgProfit}</span>
              <span className="text-gray-400">/</span>
              <span className="text-rose-400">-₹{avgLoss}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Risk-Reward Ratio</span>
          </div>
        </div>

        {/* P&L Cumulative Performance Graph */}
        {pnlCurveData.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold font-mono text-white uppercase">
              CUMULATIVE P&L CURVE — CURRENT FINANCIAL YEAR
            </h3>
            <div className="h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlCurveData}>
                  <defs>
                    <linearGradient id="pnlCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="trade" stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis stroke="#666" tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Cumulative P&L']}
                  />
                  <Area type="monotone" dataKey="pnl" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#pnlCurve)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Trade Journal Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              JOURNAL RECORDS ({trades.length})
            </div>
            <span className="text-[11px] font-mono text-gray-400">READ ONLY MODE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-white/10 text-[10px] uppercase">
                  <th className="py-3 px-3">DATE</th>
                  <th className="py-3 px-3">DAY</th>
                  <th className="py-3 px-3">SYMBOL</th>
                  <th className="py-3 px-3">STRATEGY</th>
                  <th className="py-3 px-3">EXPIRY</th>
                  <th className="py-3 px-3 text-right">QUANTITY</th>
                  <th className="py-3 px-3 text-center">
                    <div>PROBABILITY OF</div>
                    <div>PROFIT</div>
                  </th>
                  <th className="py-3 px-3 text-center">STATUS</th>
                  <th className="py-3 px-3 text-right">P&L</th>
                  <th className="py-3 px-3 text-center">TRADE CLOSE DATE</th>
                  <th className="py-3 px-3 text-center">
                    <div>HOLD TIME</div>
                    <div>( DAYS )</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-gray-500 font-mono text-sm">
                      {isLoading ? 'SYNCING GOOGLE SHEET RECORDS...' : 'NO TRADES RECORDED IN JOURNAL.'}
                    </td>
                  </tr>
                ) : (
                  trades.map((t) => {
                    const statusUpper = (t.status || '').toUpperCase();
                    const isOpen = statusUpper.includes('OPEN') || statusUpper.includes('RUNNING');
                    const isClosedProfit = statusUpper === 'CLOSED PROFIT' || (statusUpper === 'CLOSED' && t.manualPnl >= 0);
                    const isClosedLoss = statusUpper === 'CLOSED LOSS' || (statusUpper === 'CLOSED' && t.manualPnl < 0);
                    const isPos = t.manualPnl > 0;
                    const isNeg = t.manualPnl < 0;

                    let statusBadgeClass = 'bg-neutral-800 text-gray-300';
                    let statusText = t.status;

                    if (isOpen) {
                      statusBadgeClass = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
                      statusText = t.status;
                    } else if (isClosedProfit) {
                      statusBadgeClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                      statusText = 'CLOSED PROFIT';
                    } else if (isClosedLoss) {
                      statusBadgeClass = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
                      statusText = 'CLOSED LOSS';
                    }

                    return (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{t.date || '-'}</td>
                        <td className="py-3 px-3 text-amber-400 font-bold whitespace-nowrap">{t.day || '-'}</td>
                        <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{t.symbol || '-'}</td>
                        <td className="py-3 px-3 text-amber-400 whitespace-nowrap">{t.strategy || '-'}</td>
                        <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{t.expiry || '-'}</td>
                        <td className="py-3 px-3 text-right text-gray-300 font-bold">{t.qty || 0}</td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-bold">{Number(t.pop || 70).toFixed(1)}%</td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold text-sm whitespace-nowrap ${
                          isOpen ? 'text-gray-500' : isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-gray-300'
                        }`}>
                          {isOpen ? '₹0.00' : `${isPos ? '+' : ''}₹${t.manualPnl.toLocaleString('en-IN')}`}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-400 whitespace-nowrap">{t.tradeCloseDate || '-'}</td>
                        <td className="py-3 px-3 text-center text-gray-300 font-bold whitespace-nowrap">
                          {t.holdTime !== '-' ? `${t.holdTime} Days` : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
