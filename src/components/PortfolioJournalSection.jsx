import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BookOpen, Shield, Settings, CheckCircle, X, Calendar } from 'lucide-react';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=0';
const TRADES_STORAGE_KEY = 'deltafox_portfolio_trades_v5';
const FY_CONFIG_STORAGE_KEY = 'deltafox_fy_config_v1';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE',
  'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
];

// Helper to parse dates in DD/MM/YYYY or YYYY-MM-DD format
function parseTradeDate(str) {
  if (!str || str === '-' || str === 'OPEN') return null;
  const parts = str.split('/');
  if (parts.length === 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    if (month >= 0 && month < 12 && day >= 1 && day <= 31 && year > 2000) {
      return new Date(year, month, day);
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Helper to format Date object as YYYY-MM-DD key
function formatDateKey(dateObj) {
  if (!dateObj) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper function to parse CSV lines safely matching Google Sheet headers
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

    if (cols.length >= 7) {
      const date = cols[0] || '';
      const day = cols[1] || '';
      const symbol = (cols[2] || '').toUpperCase();
      const strategy = cols[3] || 'Short Strangle';
      const expiry = cols[4] || date;
      const qty = parseInt(cols[5], 10) || 0;

      let popRaw = (cols[6] || '70.0').replace(/%/g, '').trim();
      const pop = parseFloat(popRaw) || 70.0;

      const tradeCloseDate = cols[7] || '-';

      let holdRaw = (cols[8] || '-').replace(/\D/g, '');
      const holdTime = holdRaw ? parseInt(holdRaw, 10) : '-';

      const status = (cols[9] || 'OPEN').toUpperCase();

      let pnlRaw = (cols[10] || '0').replace(/[^\d.-]/g, '');
      const manualPnl = parseFloat(pnlRaw) || 0;

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
          tradeCloseDate,
          holdTime,
          status,
          manualPnl
        });
      }
    }
  }

  return parsedTrades;
}

export default function PortfolioJournalSection() {
  // Trades state initialized from local cache
  const [trades, setTrades] = useState(() => {
    try {
      const saved = localStorage.getItem(TRADES_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored trades:', e);
    }
    return [];
  });

  // Admin Financial Year Configuration (Default: March 2026 to April 2027)
  const [fyConfig, setFyConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(FY_CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored FY config:', e);
    }
    return {
      startMonth: 2, // March (0-indexed)
      startYear: 2026,
      endMonth: 3,   // April (0-indexed)
      endYear: 2027
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passError, setPassError] = useState('');
  const [tempFyConfig, setTempFyConfig] = useState({ ...fyConfig });
  const [hoveredDay, setHoveredDay] = useState(null);

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
            localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(parsedSheetTrades));
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

  // Compute Financial Year Date Range Limits
  const fyStartDate = useMemo(() => {
    return new Date(fyConfig.startYear, fyConfig.startMonth, 1, 0, 0, 0);
  }, [fyConfig]);

  const fyEndDate = useMemo(() => {
    return new Date(fyConfig.endYear, fyConfig.endMonth + 1, 0, 23, 59, 59);
  }, [fyConfig]);

  // Filter Trades by configured Financial Year
  const fyTrades = useMemo(() => {
    return trades.filter((t) => {
      const tradeDateObj = parseTradeDate(t.tradeCloseDate !== '-' ? t.tradeCloseDate : t.date);
      if (!tradeDateObj) return true; // Include if date parsing unavailable
      return tradeDateObj >= fyStartDate && tradeDateObj <= fyEndDate;
    });
  }, [trades, fyStartDate, fyEndDate]);

  // Key Portfolio Metrics for current Financial Year
  const isTradeClosed = (t) => t.status === 'CLOSED PROFIT' || t.status === 'CLOSED LOSS' || t.status === 'CLOSED';
  const closedTrades = fyTrades.filter(isTradeClosed);
  const winningTrades = closedTrades.filter(t => t.manualPnl > 0 || t.status === 'CLOSED PROFIT');
  const losingTrades = closedTrades.filter(t => t.manualPnl < 0 || t.status === 'CLOSED LOSS');

  const totalTradesCount = fyTrades.length;
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
  const pnlCurveData = closedTrades.map((t, idx) => {
    runningPnl += t.manualPnl;
    return {
      trade: `Trade ${idx + 1}`,
      pnl: runningPnl,
      tradePnl: t.manualPnl
    };
  });

  // Display trades in reverse order so latest trades appear at top of table
  const displayTrades = useMemo(() => [...fyTrades].reverse(), [fyTrades]);

  // Build Daily P&L Map for Heatmap
  const dailyPnlMap = useMemo(() => {
    const map = {};
    closedTrades.forEach((t) => {
      const dateObj = parseTradeDate(t.tradeCloseDate !== '-' ? t.tradeCloseDate : t.date);
      if (dateObj) {
        const key = formatDateKey(dateObj);
        if (!map[key]) {
          map[key] = { pnl: 0, count: 0, wins: 0, losses: 0 };
        }
        map[key].pnl += t.manualPnl;
        map[key].count += 1;
        if (t.manualPnl > 0) map[key].wins += 1;
        if (t.manualPnl < 0) map[key].losses += 1;
      }
    });
    return map;
  }, [closedTrades]);

  // Generate Month Grid Columns for the Financial Year Heatmap
  const heatmapMonths = useMemo(() => {
    const months = [];
    let cur = new Date(fyConfig.startYear, fyConfig.startMonth, 1);
    const end = new Date(fyConfig.endYear, fyConfig.endMonth, 1);

    while (cur <= end) {
      const year = cur.getFullYear();
      const monthIdx = cur.getMonth();
      const monthLabel = `${MONTH_NAMES[monthIdx]} ${String(year).slice(-2)}`;

      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
      const daysList = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, monthIdx, d);
        const key = formatDateKey(dateObj);
        const dayPnlInfo = dailyPnlMap[key] || { pnl: 0, count: 0, wins: 0, losses: 0 };
        daysList.push({
          date: dateObj,
          dayNum: d,
          key,
          pnl: dayPnlInfo.pnl,
          count: dayPnlInfo.count,
          wins: dayPnlInfo.wins,
          losses: dayPnlInfo.losses
        });
      }

      months.push({
        label: monthLabel,
        year,
        monthIdx,
        days: daysList
      });

      cur = new Date(year, monthIdx + 1, 1);
    }
    return months;
  }, [fyConfig, dailyPnlMap]);

  // Handle Admin Passkey Submit
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasskey === 'deltafox2026') {
      setIsAuthenticated(true);
      setPassError('');
    } else {
      setPassError('Invalid admin passkey. Please try again.');
    }
  };

  // Handle FY Save
  const handleSaveFyConfig = () => {
    setFyConfig(tempFyConfig);
    localStorage.setItem(FY_CONFIG_STORAGE_KEY, JSON.stringify(tempFyConfig));
    setIsAdminOpen(false);
  };

  const startMonthName = `${MONTH_NAMES[fyConfig.startMonth]} ${fyConfig.startYear}`;
  const endMonthName = `${MONTH_NAMES[fyConfig.endMonth]} ${fyConfig.endYear}`;

  return (
    <section id="portfolio" className="pt-8 sm:pt-10 pb-16 scroll-mt-20 bg-[#050505] border-t border-white/5 relative">
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
              Track trade execution, entry/exit, financial year statement ({startMonthName} – {endMonthName}), and disciplined P&L analytics directly synced from trade database.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => {
                setTempFyConfig({ ...fyConfig });
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 animate-spin-slow" />
              <span>ADMIN FY SETTINGS</span>
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE SYNCED WITH TRADE DATABASE</span>
            </div>
          </div>
        </div>

        {/* Portfolio Performance Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">TOTAL TRADES ({startMonthName} – {endMonthName})</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{totalTradesCount}</div>
            <span className="text-[10px] font-mono text-amber-400">{closedTrades.length} Closed / {fyTrades.length - closedTrades.length} Open</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">WIN RATE</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{winRate}%</div>
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
            <span className="text-[10px] font-mono text-gray-400">{startMonthName} – {endMonthName}</span>
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

        {/* P&L Contribution Heatmap Grid */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-extrabold font-mono text-white uppercase tracking-wider">
                DAILY P&L PERFORMANCE HEATMAP ({startMonthName} – {endMonthName})
              </h3>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-mono text-gray-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-white/10 border border-white/10"></span>
                <span>No Trades</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                <span>Profit Day</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-sm shadow-rose-500/50"></span>
                <span>Loss Day</span>
              </div>
            </div>
          </div>

          {/* Month Columns Grid */}
          <div className="overflow-x-auto pt-2 pb-1">
            <div className="flex space-x-4 min-w-[850px] justify-between">
              {heatmapMonths.map((m) => (
                <div key={`${m.year}_${m.monthIdx}`} className="flex flex-col items-center space-y-2">
                  {/* Daily Boxes Block (5 cols x 7 rows grid layout) */}
                  <div className="grid grid-cols-5 gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-lg">
                    {m.days.map((d) => {
                      const isTraded = d.count > 0;
                      const isProfit = isTraded && d.pnl > 0;
                      const isLoss = isTraded && d.pnl < 0;

                      let boxClass = 'bg-white/5 border-white/5 text-transparent hover:border-white/30';
                      if (isProfit) {
                        boxClass = 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50 hover:bg-emerald-400';
                      } else if (isLoss) {
                        boxClass = 'bg-rose-500 border-rose-400 shadow-sm shadow-rose-500/50 hover:bg-rose-400';
                      }

                      return (
                        <div
                          key={d.key}
                          onMouseEnter={() => setHoveredDay(d)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-3.5 h-3.5 rounded-[2px] border transition-all cursor-pointer relative ${boxClass}`}
                        />
                      );
                    })}
                  </div>

                  {/* Month Label */}
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip Hover Banner / Popup */}
          {hoveredDay && (
            <div className="absolute top-3 right-6 bg-neutral-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-mono shadow-xl z-20 flex items-center space-x-3 animate-fadeIn">
              <span className="text-gray-400">
                {hoveredDay.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-gray-600">|</span>
              {hoveredDay.count === 0 ? (
                <span className="text-gray-400">No Closed Trades</span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${hoveredDay.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hoveredDay.pnl >= 0 ? '+' : ''}₹{hoveredDay.pnl.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-400">({hoveredDay.count} Trade{hoveredDay.count > 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* P&L Cumulative Performance Graph */}
        {pnlCurveData.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold font-mono text-white uppercase">
              CUMULATIVE P&L CURVE — FINANCIAL YEAR ({startMonthName} – {endMonthName})
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
                  <RechartsTooltip
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
              JOURNAL RECORDS ({displayTrades.length}) — {startMonthName} to {endMonthName}
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
                  <th className="py-3 px-3 text-center">TRADE CLOSE DATE</th>
                  <th className="py-3 px-3 text-center">
                    <div>HOLD TIME</div>
                    <div>( DAYS )</div>
                  </th>
                  <th className="py-3 px-3 text-center">STATUS</th>
                  <th className="py-3 px-3 text-right">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayTrades.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-gray-500 font-mono text-sm">
                      {isLoading ? 'SYNCING GOOGLE SHEET RECORDS...' : 'NO TRADES RECORDED IN THIS FINANCIAL YEAR.'}
                    </td>
                  </tr>
                ) : (
                  displayTrades.map((t) => {
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
                        <td className="py-3 px-3 text-center text-gray-400 whitespace-nowrap">{t.tradeCloseDate || '-'}</td>
                        <td className="py-3 px-3 text-center text-gray-300 font-bold whitespace-nowrap">
                          {t.holdTime !== '-' ? `${t.holdTime} Days` : '-'}
                        </td>
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
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Admin Financial Year Settings Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">

            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono uppercase">ADMIN FY CONFIGURATION</h3>
                <p className="text-xs text-gray-400 font-mono">Set active Financial Year range for trade analytics</p>
              </div>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 uppercase">Admin Passkey</label>
                  <input
                    type="password"
                    placeholder="Enter passkey..."
                    value={adminPasskey}
                    onChange={(e) => setAdminPasskey(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  {passError && <p className="text-xs text-rose-400 font-mono mt-1">{passError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                >
                  AUTHENTICATE ADMIN
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Authenticated as Admin</span>
                </div>

                {/* Financial Year Start Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-amber-400 font-bold uppercase">START FINANCIAL MONTH & YEAR</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tempFyConfig.startMonth}
                      onChange={(e) => setTempFyConfig({ ...tempFyConfig, startMonth: parseInt(e.target.value, 10) })}
                      className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={tempFyConfig.startYear}
                      onChange={(e) => setTempFyConfig({ ...tempFyConfig, startYear: parseInt(e.target.value, 10) || 2026 })}
                      className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Financial Year End Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-amber-400 font-bold uppercase">END FINANCIAL MONTH & YEAR</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tempFyConfig.endMonth}
                      onChange={(e) => setTempFyConfig({ ...tempFyConfig, endMonth: parseInt(e.target.value, 10) })}
                      className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={tempFyConfig.endYear}
                      onChange={(e) => setTempFyConfig({ ...tempFyConfig, endYear: parseInt(e.target.value, 10) || 2027 })}
                      className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={handleSaveFyConfig}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    SAVE FINANCIAL YEAR RANGE
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-mono text-xs uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
