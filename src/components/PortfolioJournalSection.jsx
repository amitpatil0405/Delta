import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BookOpen, Plus, Lock, Unlock, Trash2, LogIn, LogOut, AlertCircle, Edit2, Save, X } from 'lucide-react';

const STORAGE_KEY = 'deltafox_portfolio_trades_v3';
const ADMIN_SESSION_KEY = 'deltafox_admin_logged_in';

// Shared Global Database Endpoint for Portfolio Journal Sync
const GLOBAL_DB_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a06c9fbbfb10f9';

export default function PortfolioJournalSection() {
  // Admin authentication state (Session Persisted)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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

  // Selected trade IDs for bulk deletion
  const [selectedTradeIds, setSelectedTradeIds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit Trade Modal State
  const [editingTrade, setEditingTrade] = useState(null);

  // Helper to sync trades array to Cloud DB & Local Storage
  const syncTradesToCloud = async (updatedTrades) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades.slice(0, 200)));
      await fetch(GLOBAL_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'deltafox_portfolio_trades',
          data: { trades: updatedTrades.slice(0, 200) }
        })
      });
    } catch (err) {
      console.warn('Cloud sync error:', err);
    }
  };

  // Fetch Global Trades on mount & Periodic Sync (every 15s)
  useEffect(() => {
    const fetchGlobalTrades = async () => {
      try {
        const res = await fetch(GLOBAL_DB_URL);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && Array.isArray(json.data.trades)) {
            setTrades(json.data.trades);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data.trades));
          }
        }
      } catch (e) {
        console.warn('Failed to fetch global trades:', e);
      }
    };

    fetchGlobalTrades();
    const interval = setInterval(fetchGlobalTrades, 15000);
    return () => clearInterval(interval);
  }, []);

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginPassword === 'Pass123#$') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setShowLoginModal(false);
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError('Invalid Admin Password. Access Denied.');
    }
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setShowAddForm(false);
    setSelectedTradeIds([]);
  };

  // Single Trade Deletion
  const handleDeleteSingleTrade = (tradeId) => {
    if (!isAdminLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete this trade record?')) {
      const updated = trades.filter(t => t.id !== tradeId);
      setTrades(updated);
      setSelectedTradeIds(prev => prev.filter(id => id !== tradeId));
      syncTradesToCloud(updated);
    }
  };

  // Bulk Trade Deletion
  const handleDeleteSelectedTrades = () => {
    if (!isAdminLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (selectedTradeIds.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTradeIds.length} selected trade record(s)?`)) {
      const updated = trades.filter(t => !selectedTradeIds.includes(t.id));
      setTrades(updated);
      setSelectedTradeIds([]);
      syncTradesToCloud(updated);
    }
  };

  // Select All Checkbox Handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTradeIds(trades.map(t => t.id));
    } else {
      setSelectedTradeIds([]);
    }
  };

  // Row Checkbox Toggle
  const handleSelectTrade = (tradeId) => {
    setSelectedTradeIds(prev =>
      prev.includes(tradeId)
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  // Helper to calculate days between dates
  const calculateDaysDiff = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 7;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  // New trade form state
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    symbol: 'NIFTY 50',
    strategy: 'Short Strangle',
    expiry: '2025-03-27',
    qty: 50,
    pop: 70.0,
    holdTime: 12,
    status: 'OPEN',
    manualPnl: 0
  });

  const handleCreateTrade = (e) => {
    e.preventDefault();

    if (!isAdminLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (trades.length >= 200) {
      alert('Maximum capacity of 200 trade records reached.');
      return;
    }

    let finalStatus = newTrade.status;
    if (finalStatus === 'CLOSED') {
      const pnlVal = parseFloat(newTrade.manualPnl) || 0;
      finalStatus = pnlVal >= 0 ? 'CLOSED PROFIT' : 'CLOSED LOSS';
    }

    let calculatedPnl = 0;
    if (finalStatus === 'OPEN') {
      calculatedPnl = 0;
    } else {
      calculatedPnl = parseFloat(newTrade.manualPnl) || 0;
    }

    const autoHold = calculateDaysDiff(newTrade.date, newTrade.expiry);

    const created = {
      id: `t_${Date.now()}`,
      date: newTrade.date,
      symbol: newTrade.symbol,
      strategy: newTrade.strategy,
      expiry: newTrade.expiry,
      entryPrice: 0,
      exitPrice: null,
      qty: parseInt(newTrade.qty) || 50,
      pop: parseFloat(newTrade.pop) || 68.0,
      holdTime: parseInt(newTrade.holdTime) || autoHold,
      status: finalStatus,
      manualPnl: calculatedPnl
    };

    const updated = [created, ...trades];
    setTrades(updated);
    syncTradesToCloud(updated);
    setShowAddForm(false);
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      symbol: 'NIFTY 50',
      strategy: 'Short Strangle',
      expiry: '2025-03-27',
      qty: 50,
      pop: 70.0,
      holdTime: 12,
      status: 'OPEN',
      manualPnl: 0
    });
  };

  // Open Edit Trade Modal for Admin
  const handleOpenEditTrade = (trade) => {
    if (!isAdminLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const autoHold = calculateDaysDiff(trade.date, trade.expiry);

    setEditingTrade({
      id: trade.id,
      date: trade.date,
      symbol: trade.symbol,
      strategy: trade.strategy,
      expiry: trade.expiry,
      entryPrice: trade.entryPrice || 0,
      exitPrice: trade.exitPrice !== null && trade.exitPrice !== undefined ? trade.exitPrice : null,
      qty: trade.qty,
      pop: trade.pop !== undefined && trade.pop !== null ? trade.pop : 68.0,
      holdTime: trade.holdTime !== undefined && trade.holdTime !== null ? trade.holdTime : autoHold,
      status: trade.status === 'CLOSED' ? (trade.manualPnl >= 0 ? 'CLOSED PROFIT' : 'CLOSED LOSS') : trade.status,
      manualPnl: trade.manualPnl
    });
  };

  // Save Modified Trade Record
  const handleSaveEditedTrade = (e) => {
    e.preventDefault();

    if (!isAdminLoggedIn || !editingTrade) return;

    const isOpen = editingTrade.status === 'OPEN';

    let finalStatus = editingTrade.status;
    let finalPnl = 0;

    if (isOpen) {
      finalPnl = 0;
    } else {
      finalPnl = parseFloat(editingTrade.manualPnl) || 0;
      if (finalStatus === 'CLOSED') {
        finalStatus = finalPnl >= 0 ? 'CLOSED PROFIT' : 'CLOSED LOSS';
      }
    }

    const autoHold = calculateDaysDiff(editingTrade.date, editingTrade.expiry);

    const updated = trades.map(t => {
      if (t.id === editingTrade.id) {
        return {
          ...t,
          date: editingTrade.date,
          symbol: editingTrade.symbol,
          strategy: editingTrade.strategy,
          expiry: editingTrade.expiry,
          qty: parseInt(editingTrade.qty) || 0,
          pop: parseFloat(editingTrade.pop) || 68.0,
          holdTime: parseInt(editingTrade.holdTime) || autoHold,
          status: finalStatus,
          manualPnl: finalPnl
        };
      }
      return t;
    });

    setTrades(updated);
    syncTradesToCloud(updated);
    setEditingTrade(null);
  };

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
    <section id="portfolio" className="py-20 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header & Central Admin Control Panel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Institutional Trading Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              PORTFOLIO & TRADING JOURNAL
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Track trade execution, entry/exit prices, financial year performance, and disciplined P&L analytics.
            </p>
          </div>

          {/* Central Admin Status & Action Buttons */}
          <div className="flex items-center flex-wrap gap-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>ADMIN LOGGED IN</span>
                </span>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:bg-neutral-800 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError('');
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold hover:bg-neutral-800 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>CENTRAL ADMIN LOGIN</span>
              </button>
            )}

            {isAdminLoggedIn && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold font-mono uppercase bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>RECORD NEW TRADE</span>
              </button>
            )}
          </div>
        </div>

        {/* Portfolio Performance Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">TOTAL TRADES</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{totalTradesCount} / 200</div>
            <span className="text-[10px] font-mono text-amber-400">{closedTrades.length} Closed / {trades.length - closedTrades.length} Open</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">WIN RATE</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">{winRate}%</div>
            <span className="text-[10px] font-mono text-gray-400">{winningTrades.length} Wins / {losingTrades.length} Losses</span>
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
            <div className="text-xl font-extrabold font-mono text-amber-400 mt-1">
              +₹{avgProfit} / -₹{avgLoss}
            </div>
            <span className="text-[10px] font-mono text-gray-400">Risk-Reward Ratio</span>
          </div>
        </div>

        {/* Admin Edit Trade Modal */}
        {editingTrade && isAdminLoggedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0a0a0c] border border-amber-500/40 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-sm font-bold">
                  <Edit2 className="w-4 h-4" />
                  <span>MODIFY TRADE RECORD — ADMIN CONTROL</span>
                </div>
                <button
                  onClick={() => setEditingTrade(null)}
                  className="text-gray-400 hover:text-white font-mono text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedTrade} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">TRADE DATE</label>
                    <input
                      type="date"
                      required
                      value={editingTrade.date}
                      onChange={(e) => setEditingTrade({ ...editingTrade, date: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">SYMBOL</label>
                    <input
                      type="text"
                      required
                      value={editingTrade.symbol}
                      onChange={(e) => setEditingTrade({ ...editingTrade, symbol: e.target.value.toUpperCase() })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white uppercase focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">STRATEGY</label>
                    <select
                      value={editingTrade.strategy}
                      onChange={(e) => setEditingTrade({ ...editingTrade, strategy: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Short Strangle">Short Strangle</option>
                      <option value="Iron Condor">Iron Condor</option>
                      <option value="Bull Put Spread">Bull Put Spread</option>
                      <option value="Bear Call Spread">Bear Call Spread</option>
                      <option value="Covered Call">Covered Call</option>
                      <option value="Cash Secured Put">Cash Secured Put</option>
                      <option value="Long Straddle">Long Straddle</option>
                      <option value="Long Strangle">Long Strangle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">EXPIRY DATE</label>
                    <input
                      type="date"
                      required
                      value={editingTrade.expiry}
                      onChange={(e) => setEditingTrade({ ...editingTrade, expiry: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>


                  <div>
                    <label className="block text-gray-400 mb-1">QUANTITY</label>
                    <input
                      type="number"
                      required
                      value={editingTrade.qty}
                      onChange={(e) => setEditingTrade({ ...editingTrade, qty: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">PROBABILITY OF PROFIT (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 72.5"
                      value={editingTrade.pop}
                      onChange={(e) => setEditingTrade({ ...editingTrade, pop: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">HOLD TIME (DAYS)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 12"
                      value={editingTrade.holdTime}
                      onChange={(e) => setEditingTrade({ ...editingTrade, holdTime: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">STATUS</label>
                    <select
                      value={editingTrade.status}
                      onChange={(e) => setEditingTrade({ ...editingTrade, status: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold"
                    >
                      <option value="OPEN" className="text-amber-400">OPEN</option>
                      <option value="CLOSED PROFIT" className="text-emerald-400">CLOSED PROFIT</option>
                      <option value="CLOSED LOSS" className="text-rose-400">CLOSED LOSS</option>
                    </select>
                  </div>

                  {editingTrade.status !== 'OPEN' && (
                    <div>
                      <label className="block text-gray-400 mb-1">TOTAL PROFIT / LOSS (₹)</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="e.g. 2500 or -1500"
                        value={editingTrade.manualPnl}
                        onChange={(e) => setEditingTrade({ ...editingTrade, manualPnl: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingTrade(null)}
                    className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-5 py-2 bg-amber-500 text-black font-mono font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0a0a0c] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-sm font-bold">
                  <Lock className="w-4 h-4" />
                  <span>CENTRAL ADMIN LOGIN</span>
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-400 hover:text-white font-mono text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Log in as Central Admin to manage, record, or delete portfolio trades without needing repeated authentication.
              </p>

              {loginError && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">ADMIN PASSWORD</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 text-black font-mono font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
                  >
                    LOGIN AS ADMIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Trade Entry Form Modal / Drawer */}
        {showAddForm && isAdminLoggedIn && (
          <form onSubmit={handleCreateTrade} className="glass-card rounded-2xl p-6 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold font-mono text-amber-400 uppercase tracking-wider">
                RECORD NEW TRADE — ADMIN ENTRY
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ADMIN AUTHORIZED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">TRADE DATE</label>
                <input
                  type="date"
                  required
                  value={newTrade.date}
                  onChange={(e) => setNewTrade({ ...newTrade, date: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">UNDERLYING SYMBOL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIFTY 50"
                  value={newTrade.symbol}
                  onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value.toUpperCase() })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white uppercase focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">STRATEGY</label>
                <select
                  value={newTrade.strategy}
                  onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Short Strangle">Short Strangle</option>
                  <option value="Iron Condor">Iron Condor</option>
                  <option value="Partial Iron Condor">Partial Iron Condor</option>
                  <option value="Bull Put Spread">Bull Put Spread</option>
                  <option value="Bear Call Spread">Bear Call Spread</option>
                  <option value="Covered Call">Covered Call</option>
                  <option value="Cash Secured Put">Cash Secured Put</option>
                  <option value="Long Straddle">Long Straddle</option>
                  <option value="Long Strangle">Long Strangle</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">EXPIRY DATE</label>
                <input
                  type="date"
                  required
                  value={newTrade.expiry}
                  onChange={(e) => setNewTrade({ ...newTrade, expiry: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>


              <div>
                <label className="block text-gray-400 mb-1">QUANTITY</label>
                <input
                  type="number"
                  required
                  value={newTrade.qty}
                  onChange={(e) => setNewTrade({ ...newTrade, qty: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">PROBABILITY OF PROFIT (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="70.0"
                  value={newTrade.pop}
                  onChange={(e) => setNewTrade({ ...newTrade, pop: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">HOLD TIME (DAYS)</label>
                <input
                  type="number"
                  required
                  placeholder="12"
                  value={newTrade.holdTime}
                  onChange={(e) => setNewTrade({ ...newTrade, holdTime: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">STATUS</label>
                <select
                  value={newTrade.status}
                  onChange={(e) => setNewTrade({ ...newTrade, status: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold"
                >
                  <option value="OPEN" className="text-amber-400">OPEN</option>
                  <option value="CLOSED PROFIT" className="text-emerald-400">CLOSED PROFIT</option>
                  <option value="CLOSED LOSS" className="text-rose-400">CLOSED LOSS</option>
                </select>
              </div>

              {newTrade.status !== 'OPEN' && (
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">MANUAL PROFIT / LOSS (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000 or -5000"
                    value={newTrade.manualPnl}
                    onChange={(e) => setNewTrade({ ...newTrade, manualPnl: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-bold"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 text-black font-mono font-bold text-xs rounded-lg hover:bg-amber-400 transition-all"
              >
                SAVE TRADE TO JOURNAL
              </button>
            </div>
          </form>
        )}

        {/* P&L Cumulative Performance Graph */}
        {pnlCurveData.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold font-mono text-white uppercase">
              CUMULATIVE P&L CURVE — CURRENT FINANCIAL YEAR
            </h3>
            <div className="h-[280px] w-full pt-2">
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

        {/* Trade Journal Table with Bulk Selection & Actions */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-hidden space-y-4">

          {/* Table Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white">
              <span>JOURNAL RECORDS ({trades.length} / 200)</span>
            </div>

            {isAdminLoggedIn && selectedTradeIds.length > 0 && (
              <button
                onClick={handleDeleteSelectedTrades}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 text-xs font-mono font-bold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE SELECTED ({selectedTradeIds.length})</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-white/10 text-[10px] uppercase">
                  {isAdminLoggedIn && (
                    <th className="py-3 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={trades.length > 0 && selectedTradeIds.length === trades.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Symbol</th>
                  <th className="py-3 px-3">Strategy</th>
                  <th className="py-3 px-3">Expiry</th>
                  <th className="py-3 px-3 text-right">Quantity</th>
                  <th className="py-3 px-3 text-right">Probability of Profit</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">P&L</th>
                  <th className="py-3 px-3 text-right">Hold Time in Days</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={isAdminLoggedIn ? 11 : 10} className="py-12 text-center text-gray-500 font-mono text-sm">
                      NO TRADES RECORDED IN JOURNAL.
                    </td>
                  </tr>
                ) : (
                  trades.map((t) => {
                    const isOpen = t.status === 'OPEN';
                    const isClosedProfit = t.status === 'CLOSED PROFIT' || (t.status === 'CLOSED' && t.manualPnl >= 0);
                    const isClosedLoss = t.status === 'CLOSED LOSS' || (t.status === 'CLOSED' && t.manualPnl < 0);
                    const isPos = t.manualPnl > 0;
                    const isNeg = t.manualPnl < 0;
                    const isSelected = selectedTradeIds.includes(t.id);

                    let statusBadgeClass = 'bg-neutral-800 text-gray-300';
                    let statusText = t.status;

                    if (isOpen) {
                      statusBadgeClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
                      statusText = 'OPEN';
                    } else if (isClosedProfit) {
                      statusBadgeClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                      statusText = 'CLOSED PROFIT';
                    } else if (isClosedLoss) {
                      statusBadgeClass = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
                      statusText = 'CLOSED LOSS';
                    }

                    // Auto-calculate hold time if missing
                    let displayHoldDays = t.holdTime;
                    if (displayHoldDays === undefined || displayHoldDays === null) {
                      if (t.date && t.expiry) {
                        const start = new Date(t.date);
                        const end = new Date(t.expiry);
                        const diffTime = Math.abs(end - start);
                        displayHoldDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
                      } else {
                        displayHoldDays = 0;
                      }
                    }

                    // Default probability of profit if missing
                    const displayPop = t.pop !== undefined && t.pop !== null ? t.pop : 68.0;

                    return (
                      <tr key={t.id} className={`hover:bg-white/5 transition-colors ${isSelected ? 'bg-amber-500/10' : ''}`}>
                        {isAdminLoggedIn && (
                          <td className="py-3 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectTrade(t.id)}
                              className="rounded border-gray-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="py-3 px-3 text-gray-400">{t.date}</td>
                        <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                        <td className="py-3 px-3 text-amber-400">{t.strategy}</td>
                        <td className="py-3 px-3 text-gray-400">{t.expiry}</td>
                        <td className="py-3 px-3 text-right text-gray-300 font-bold">{t.qty}</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">{Number(displayPop).toFixed(1)}%</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold text-sm ${
                          isOpen ? 'text-gray-500' : isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-gray-300'
                        }`}>
                          {isOpen ? '₹0.00' : `${isPos ? '+' : ''}₹${t.manualPnl.toLocaleString('en-IN')}`}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-300 font-bold">{displayHoldDays} {displayHoldDays === 1 ? 'Day' : 'Days'}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {isAdminLoggedIn ? (
                              <>
                                <button
                                  onClick={() => handleOpenEditTrade(t)}
                                  title="Edit Trade Details"
                                  className="inline-flex items-center space-x-1 px-2 py-1 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/30 transition-all"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>EDIT</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSingleTrade(t.id)}
                                  title="Delete Record"
                                  className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-500 italic">READ ONLY</span>
                            )}
                          </div>
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
