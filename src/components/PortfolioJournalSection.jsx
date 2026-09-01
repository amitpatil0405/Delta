import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BookOpen, Plus, TrendingUp, TrendingDown, DollarSign, Award, Percent, ShieldAlert, Calendar } from 'lucide-react';

// Benchmark trade history records (Supports up to 200 records per financial year)
const INITIAL_TRADES_FY24_25 = [
  { id: 't1', date: '2024-10-15', symbol: 'NIFTY 50', strategy: 'Short Strangle', expiry: '2024-10-31', entryPrice: 145.00, exitPrice: 35.00, qty: 150, status: 'CLOSED', manualPnl: 16500 },
  { id: 't2', date: '2024-11-04', symbol: 'BANK NIFTY', strategy: 'Iron Condor', expiry: '2024-11-28', entryPrice: 210.00, exitPrice: 80.00, qty: 60, status: 'CLOSED', manualPnl: 7800 },
  { id: 't3', date: '2024-12-02', symbol: 'NIFTY 50', strategy: 'Bull Put Spread', expiry: '2024-12-26', entryPrice: 95.00, exitPrice: 20.00, qty: 200, status: 'CLOSED', manualPnl: 15000 },
  { id: 't4', date: '2025-01-08', symbol: 'RELIANCE', strategy: 'Covered Call', expiry: '2025-01-30', entryPrice: 42.00, exitPrice: 115.00, qty: 250, status: 'CLOSED', manualPnl: -18250 },
  { id: 't5', date: '2025-02-03', symbol: 'NIFTY 50', strategy: 'Short Strangle', expiry: '2025-02-27', entryPrice: 180.00, exitPrice: 45.00, qty: 150, status: 'CLOSED', manualPnl: 20250 },
  { id: 't6', date: '2025-02-20', symbol: 'BANK NIFTY', strategy: 'Bear Call Spread', expiry: '2025-02-27', entryPrice: 130.00, exitPrice: 30.00, qty: 90, status: 'CLOSED', manualPnl: 9000 },
  { id: 't7', date: '2025-03-01', symbol: 'NIFTY 50', strategy: 'Iron Condor', expiry: '2025-03-27', entryPrice: 160.00, exitPrice: null, qty: 150, status: 'OPEN', manualPnl: 0 }
];

export default function PortfolioJournalSection() {
  const [trades, setTrades] = useState(INITIAL_TRADES_FY24_25);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // New trade form state
  const [newTrade, setNewTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    symbol: 'NIFTY 50',
    strategy: 'Short Strangle',
    expiry: '2025-03-27',
    entryPrice: '',
    exitPrice: '',
    qty: 50,
    status: 'OPEN',
    manualPnl: 0
  });

  const handleCreateTrade = (e) => {
    e.preventDefault();

    if (adminPassword !== 'Pass123#$') {
      setPasswordError('Invalid Admin Password. Access Denied.');
      return;
    }

    setPasswordError('');
    const entryP = parseFloat(newTrade.entryPrice) || 0;
    const exitP = newTrade.exitPrice !== '' ? parseFloat(newTrade.exitPrice) : null;
    const isClosed = exitP !== null && newTrade.status === 'CLOSED';

    // Strictly enforce rule: open trades show 0 P&L until closed
    let calculatedPnl = 0;
    if (isClosed) {
      if (newTrade.manualPnl !== undefined && newTrade.manualPnl !== 0) {
        calculatedPnl = parseFloat(newTrade.manualPnl);
      } else {
        calculatedPnl = (entryP - exitP) * parseInt(newTrade.qty);
      }
    }

    const created = {
      id: `t_${Date.now()}`,
      date: newTrade.date,
      symbol: newTrade.symbol,
      strategy: newTrade.strategy,
      expiry: newTrade.expiry,
      entryPrice: entryP,
      exitPrice: exitP,
      qty: parseInt(newTrade.qty),
      status: isClosed ? 'CLOSED' : 'OPEN',
      manualPnl: isClosed ? calculatedPnl : 0
    };

    setTrades([created, ...trades]);
    setShowAddForm(false);
    setAdminPassword('');
    setNewTrade({
      date: new Date().toISOString().split('T')[0],
      symbol: 'NIFTY 50',
      strategy: 'Short Strangle',
      expiry: '2025-03-27',
      entryPrice: '',
      exitPrice: '',
      qty: 50,
      status: 'OPEN',
      manualPnl: 0
    });
  };

  // Close an open trade manually by entering exit price & final profit
  const handleCloseTrade = (tradeId) => {
    const exitVal = prompt('Enter Exit Price (₹):');
    if (exitVal === null) return;
    const exitPrice = parseFloat(exitVal);

    const pnlVal = prompt('Enter Total Profit/Loss amount (₹):');
    if (pnlVal === null) return;
    const manualPnl = parseFloat(pnlVal);

    setTrades(prev => prev.map(t => {
      if (t.id === tradeId) {
        return {
          ...t,
          exitPrice,
          status: 'CLOSED',
          manualPnl
        };
      }
      return t;
    }));
  };

  // Calculate Key Portfolio Metrics
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const winningTrades = closedTrades.filter(t => t.manualPnl > 0);
  const losingTrades = closedTrades.filter(t => t.manualPnl < 0);

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

        {/* Section Header & FY Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Institutional Trading Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              PORTFOLIO & TRADING JOURNAL
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Track trade execution, entry/exit prices, financial year performance, and disciplined P&L analytics.
            </p>
          </div>

          {/* Add Trade CTA */}
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setPasswordError('');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold font-mono uppercase bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD NEW TRADE</span>
            </button>
          </div>
        </div>

        {/* Portfolio Executive Performance Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">TOTAL TRADES</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{totalTradesCount}</div>
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

        {/* New Trade Entry Form Modal / Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreateTrade} className="glass-card rounded-2xl p-6 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold font-mono text-amber-400 uppercase tracking-wider">
                NEW TRADE ENTRY — CURRENT FINANCIAL YEAR
              </h3>
              <span className="text-[10px] font-mono text-gray-400">ADMIN AUTH REQUIRED</span>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {passwordError}
              </div>
            )}

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
                <label className="block text-gray-400 mb-1">ENTRY PRICE (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  placeholder="150.00"
                  value={newTrade.entryPrice}
                  onChange={(e) => setNewTrade({ ...newTrade, entryPrice: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">EXIT PRICE (₹ - LEAVE BLANK IF OPEN)</label>
                <input
                  type="number"
                  step="0.05"
                  placeholder="Optional exit price"
                  value={newTrade.exitPrice}
                  onChange={(e) => setNewTrade({ ...newTrade, exitPrice: e.target.value })}
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
                <label className="block text-gray-400 mb-1">STATUS</label>
                <select
                  value={newTrade.status}
                  onChange={(e) => setNewTrade({ ...newTrade, status: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="OPEN">OPEN (0 P&L)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {newTrade.status === 'CLOSED' && (
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">MANUAL PROFIT / LOSS (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000 or -5000"
                    value={newTrade.manualPnl}
                    onChange={(e) => setNewTrade({ ...newTrade, manualPnl: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-amber-400 mb-1 font-bold">ADMIN PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Admin Password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
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

        {/* Trade Journal Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-white/10 text-[10px] uppercase">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Symbol</th>
                  <th className="py-3 px-3">Strategy</th>
                  <th className="py-3 px-3">Expiry</th>
                  <th className="py-3 px-3 text-right">Entry (₹)</th>
                  <th className="py-3 px-3 text-right">Exit (₹)</th>
                  <th className="py-3 px-3 text-right">Qty</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">P&L (₹)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-gray-500 font-mono text-sm">
                      NO TRADES RECORDED FOR CURRENT FINANCIAL YEAR. RECORD A NEW TRADE TO BEGIN.
                    </td>
                  </tr>
                ) : (
                  trades.map((t) => {
                    const isOpen = t.status === 'OPEN';
                    const isPos = t.manualPnl > 0;
                    const isNeg = t.manualPnl < 0;

                    return (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 text-gray-400">{t.date}</td>
                        <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                        <td className="py-3 px-3 text-amber-400">{t.strategy}</td>
                        <td className="py-3 px-3 text-gray-400">{t.expiry}</td>
                        <td className="py-3 px-3 text-right text-gray-200">₹{t.entryPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right text-gray-200">
                          {t.exitPrice !== null ? `₹${t.exitPrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-300">{t.qty}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOpen ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-neutral-800 text-gray-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold text-sm ${
                          isOpen ? 'text-gray-500' : isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-gray-300'
                        }`}>
                          {isOpen ? '₹0.00' : `${isPos ? '+' : ''}₹${t.manualPnl.toLocaleString('en-IN')}`}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isOpen && (
                            <button
                              onClick={() => handleCloseTrade(t.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 text-black rounded hover:bg-amber-400 transition-all"
                            >
                              CLOSE TRADE
                            </button>
                          )}
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
