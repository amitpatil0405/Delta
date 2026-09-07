import React, { useState, useEffect } from 'react';
import { LineChart, Search, RefreshCw, CheckCircle, AlertCircle, FileText, Calendar, Layers, Activity } from 'lucide-react';

const STOCK_TECHNICAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=613914429';
const INDEX_WEEKLY_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=1423192425';

// Static fallbacks for Stock and Index analysis
const FALLBACK_STOCK_DATA = [
  {
    id: 1,
    date: '07/09/2026',
    stockName: 'SBI card',
    description: 'Technical indicators suggest that SBICARD is currently moving within a defined consolidation range, respecting key support and resistance zones established over recent sessions.'
  },
  {
    id: 2,
    date: '07/09/2026',
    stockName: 'Reliance industried ltd',
    description: 'Reliance is currently displaying strong structural stability by holding firmly above its crucial multi-week support level, preventing any sharp downward continuation.'
  }
];

const FALLBACK_INDEX_DATA = [
  {
    id: 1,
    date: '07/09/2026',
    indexName: 'Nifty 50',
    analysis: 'Nifty 50 exhibits multi-week structural support near 23,700 levels with Open Interest concentrated at OTM strike wings. Consolidation expected prior to near-term macro triggers.'
  },
  {
    id: 2,
    date: '07/09/2026',
    indexName: 'Banknifty',
    analysis: 'Bank Nifty holding critical 57,000 baseline support with banking heavyweights displaying steady accumulation. Delta-neutral strangles favored in current volatility regime.'
  },
  {
    id: 3,
    date: '07/09/2026',
    indexName: 'Sensex',
    analysis: 'BSE Sensex coiling within defined technical boundaries near 76,200. Favorable environment for defined-risk credit spreads with well-managed stop loss levels.'
  }
];

export default function TechnicalAnalysisSection() {
  const [activeTab, setActiveTab] = useState('index'); // 'index' or 'stock'
  const [stockData, setStockData] = useState(FALLBACK_STOCK_DATA);
  const [indexData, setIndexData] = useState(FALLBACK_INDEX_DATA);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('');

  const fetchAllSheetData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stock Analysis (gid=613914429)
      const stockRes = await fetch(`${STOCK_TECHNICAL_SHEET_URL}&t=${Date.now()}`);
      if (stockRes.ok) {
        const text = await stockRes.text();
        const parsed = parseStockCSV(text);
        if (parsed && parsed.length > 0) setStockData(parsed);
      }

      // 2. Fetch Index Weekly Analysis (gid=1423192425)
      const indexRes = await fetch(`${INDEX_WEEKLY_SHEET_URL}&t=${Date.now()}`);
      if (indexRes.ok) {
        const text = await indexRes.text();
        const parsedIdx = parseIndexCSV(text);
        if (parsedIdx && parsedIdx.length > 0) setIndexData(parsedIdx);
      }
    } catch (e) {
      console.error('Error fetching technical analysis CSV feeds:', e);
    } finally {
      setLoading(false);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchAllSheetData();
    const interval = setInterval(fetchAllSheetData, 10000); // 10s auto sync matching portfolio
    return () => clearInterval(interval);
  }, []);

  function parseStockCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return null;

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      if (cells.length >= 3) {
        const dateVal = cells[1]?.trim() || '';
        const stockName = cells[2]?.trim() || '';
        const description = cells[3]?.trim() || cells[2]?.trim() || '';

        if (stockName || description) {
          result.push({
            id: `stock-${i}`,
            date: dateVal || 'LIVE',
            stockName: stockName || 'EQUITY ASSET',
            description: description || 'No detailed technical justification recorded.'
          });
        }
      }
    }
    return result;
  }

  function parseIndexCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return null;

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      // Google sheet line format: Column C (cells[2]) = Date, Column D (cells[3]) = Index Name, Column E/I (cells[4]) = Analysis
      if (cells.length >= 3) {
        const dateVal = cells[2]?.trim() || cells[1]?.trim() || '';
        const indexName = cells[3]?.trim() || cells[2]?.trim() || '';
        const analysis = cells[4]?.trim() || cells[8]?.trim() || cells[3]?.trim() || '';

        if (indexName) {
          result.push({
            id: `index-${i}`,
            date: dateVal || 'WEEKLY UPDATE',
            indexName: indexName || 'BENCHMARK INDEX',
            analysis: analysis || 'Market analysis in progress. Structure holding key support and resistance zones.'
          });
        }
      }
    }
    return result;
  }

  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  const filteredStockData = stockData.filter(item => {
    const query = searchTerm.toLowerCase();
    return (
      item.stockName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  const filteredIndexData = indexData.filter(item => {
    const query = searchTerm.toLowerCase();
    return (
      item.indexName.toLowerCase().includes(query) ||
      item.analysis.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  return (
    <section id="technical-analysis" className="relative bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
              <LineChart className="w-4 h-4 text-amber-400" />
              SYSTEMATIC MARKET & STOCK ANALYSIS
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              TECHNICAL ANALYSIS & MARKET SETUPS.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-3xl font-light">
              Weekly index technical analysis for Nifty 50, Bank Nifty & Sensex, alongside trade setup justifications recorded before taking positions.
            </p>
          </div>

          <div className="flex items-center self-start md:self-auto">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>LIVE SYNCED: {lastSyncTime || 'LIVE'}</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs & Search Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">

          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('index')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'index'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>WEEKLY INDEX ANALYSIS ({indexData.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stock')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'stock'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>STOCK ANALYSIS BEFORE POSITION ({stockData.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'index' ? "Search index analysis or date..." : "Search stock name, description or date..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

        </div>

        {/* SECTION 1: WEEKLY INDEX ANALYSIS */}
        {activeTab === 'index' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Layers className="w-4 h-4" />
              <span>WEEKLY TECHNICAL ANALYSIS FOR BENCHMARK INDICES (NIFTY 50, BANK NIFTY, SENSEX)</span>
            </div>

            {loading && indexData.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 animate-pulse h-48" />
                ))}
              </div>
            ) : filteredIndexData.length === 0 ? (
              <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-12 text-center text-gray-400 font-mono text-xs">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                NO MATCHING INDEX TECHNICAL ANALYSIS RECORDS FOUND FOR "{searchTerm}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredIndexData.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-[#0a0a0d] to-[#121217] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>UPDATED: {item.date}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>LIVE INDEX SETUP</span>
                        </span>
                      </div>

                      <h3 className="text-2xl font-black font-mono text-white group-hover:text-amber-400 transition-colors uppercase pt-1">
                        {item.indexName}
                      </h3>

                      <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 leading-relaxed space-y-2">
                        <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider">
                          WEEKLY TECHNICAL ANALYSIS:
                        </span>
                        <p className="text-gray-200 text-sm font-sans font-medium leading-normal">
                          {item.analysis || 'Technical structure holding key support and resistance boundaries.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-end text-[10px] font-mono text-gray-400">
                      <span className="text-amber-400">www.deltafox.in</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: STOCK ANALYSIS BEFORE TAKING POSITION */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              <span>EQUITY TRADES & TECHNICAL ANALYSIS JUSTIFICATION BEFORE TAKING POSITION</span>
            </div>

            {loading && stockData.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 animate-pulse h-48" />
                ))}
              </div>
            ) : filteredStockData.length === 0 ? (
              <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-12 text-center text-gray-400 font-mono text-xs">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                NO MATCHING STOCK TECHNICAL ANALYSIS RECORDS FOUND FOR "{searchTerm}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStockData.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-[#0a0a0d] to-[#121217] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold font-mono text-white group-hover:text-amber-400 transition-colors uppercase">
                            {item.stockName}
                          </h3>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>DATE: {item.date}</span>
                      </span>
                    </div>

                    <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 leading-relaxed space-y-2">
                      <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider">
                        DESCRIPTION OF TECHNICAL ANALYSIS BEFORE TAKING POSITION:
                      </span>
                      <p className="text-gray-200 text-sm font-sans font-medium leading-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>PRE-POSITION VERIFIED</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        DISCIPLINED ENTRY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
