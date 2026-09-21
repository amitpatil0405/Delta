import React, { useState, useEffect } from 'react';
import { LineChart, Search, RefreshCw, CheckCircle, AlertCircle, FileText, Calendar, Layers, Activity, Megaphone } from 'lucide-react';

const STOCK_TECHNICAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=613914429';
const INDEX_WEEKLY_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=1423192425';

// Static fallbacks for Stock and Index analysis
const FALLBACK_STOCK_DATA = [];

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
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('');

  const fetchAllSheetData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stock Analysis & Announcements (gid=613914429)
      const stockRes = await fetch(`${STOCK_TECHNICAL_SHEET_URL}&t=${Date.now()}`);
      if (stockRes.ok) {
        const text = await stockRes.text();
        const { stocks, announcements: parsedAnnouncements } = parseStockAndAnnouncementCSV(text);
        setStockData(stocks);
        setAnnouncements(parsedAnnouncements);
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

  function parseFullCSV(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"' && inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell);
        if (currentRow.some(c => c.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell);
      if (currentRow.some(c => c.trim().length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  }

  function cleanCellVal(cell) {
    if (!cell) return '';
    let text = cell.trim();
    while (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
      text = text.slice(1, -1).trim();
    }
    return text;
  }

  function parseStockAndAnnouncementCSV(csvText) {
    const rows = parseFullCSV(csvText);
    if (!rows || rows.length === 0) return { stocks: [], announcements: [] };

    const stocks = [];
    const announcements = [];
    let isAnnouncementTable = false;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const col0 = cleanCellVal(row[0]);
      const col1 = cleanCellVal(row[1]); // Date
      const col2 = cleanCellVal(row[2]); // Stock Name or Status
      const col3 = cleanCellVal(row[3]); // Description or Details

      // Check if we hit Table 2 (Announcements)
      if (
        col0.toLowerCase().includes('announcement') ||
        col2.toLowerCase() === 'status' ||
        col3.toLowerCase() === 'details'
      ) {
        isAnnouncementTable = true;
        continue; // Skip header row
      }

      if (!isAnnouncementTable) {
        // Table 1: Stock Technical Analysis
        const stockLower = col2.toLowerCase();
        const descLower = col3.toLowerCase();
        const dateLower = col1.toLowerCase();

        // Skip header rows
        if (
          stockLower === 'stock name' ||
          descLower === 'description of technical analysis' ||
          dateLower === 'date'
        ) {
          continue;
        }

        // Check if this row is actually an announcement entry placed in top table ("working on stocks")
        if (stockLower === 'working on stocks' || stockLower === 'status') {
          if (col3) {
            announcements.push({
              id: `announcement-top-${i}`,
              date: col1 || 'LIVE',
              status: col2 || 'Enable',
              title: col2,
              details: col3
            });
          }
          continue; // Do not render "Working on stocks" as a stock card
        }

        // Valid Stock Entry
        if (col2 && col3) {
          stocks.push({
            id: `stock-${i}`,
            date: col1 || 'LIVE',
            stockName: col2,
            description: col3
          });
        }
      } else {
        // Table 2: Announcement(s) Section
        const statusLower = col2.toLowerCase();
        const detailsLower = col3.toLowerCase();
        const dateLower = col1.toLowerCase();

        if (
          statusLower === 'status' ||
          detailsLower === 'details' ||
          dateLower === 'date'
        ) {
          continue;
        }

        if (col2 || col3) {
          const statusVal = col2 || 'Enable';
          const detailsVal = col3;

          // Check if enabled/active
          const isEnabled =
            statusVal.toLowerCase().includes('enable') ||
            statusVal.toLowerCase().includes('active') ||
            statusVal.toLowerCase().includes('live') ||
            statusVal.toLowerCase().includes('yes') ||
            statusVal.toLowerCase().includes('true');

          if (isEnabled && detailsVal) {
            announcements.push({
              id: `announcement-${i}`,
              date: col1 || 'LIVE',
              status: statusVal,
              title: 'ANNOUNCEMENT',
              details: detailsVal
            });
          }
        }
      }
    }

    // Latest data shown on top (bottom rows in Excel moved to top of array)
    stocks.reverse();
    announcements.reverse();

    return { stocks, announcements };
  }

  function parseIndexCSV(csvText) {
    const rows = parseFullCSV(csvText);
    if (rows.length <= 1) return null;

    const result = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dateVal = cleanCellVal(row[2]);
      const indexName = cleanCellVal(row[3]);
      const analysis = cleanCellVal(row[4]);

      if (indexName && indexName.toLowerCase() !== 'index') {
        result.push({
          id: `index-${i}`,
          date: dateVal || 'WEEKLY UPDATE',
          indexName: indexName,
          analysis: analysis || 'Market analysis in progress. Structure holding key support and resistance zones.'
        });
      }
    }
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

  // Calculate dynamic tab label and combined count
  const combinedStockTabCount = stockData.length + announcements.length;
  const isOnlyAnnouncement = stockData.length === 0 && announcements.length > 0;
  const stockTabLabel = isOnlyAnnouncement ? 'ANNOUNCEMENT' : 'STOCK ANALYSIS FOR POSITIONS';
  const StockTabIcon = isOnlyAnnouncement ? Megaphone : FileText;

  return (
    <section id="technical-analysis" className="relative bg-[#050505] bg-subpage-grid text-white scroll-mt-16 sm:scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a] overflow-hidden">
      {/* Soft Ambient Radial Glow */}
      <div className="ambient-glow-amber -top-20 -left-20" />
      <div className="ambient-glow-emerald bottom-0 right-0" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

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
              <StockTabIcon className="w-4 h-4" />
              <span>{stockTabLabel} ({combinedStockTabCount})</span>
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
                        <p className="text-gray-200 text-sm font-sans font-medium leading-relaxed whitespace-pre-line">
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

            {/* ANNOUNCEMENT SECTION */}
            {announcements.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                  <Megaphone className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>PLATFORM ANNOUNCEMENT</span>
                </div>

                {/* Primary Announcement Container with Rainbow Smooth Transition */}
                <div className="relative bg-[#080d1a] border-2 rounded-2xl p-6 space-y-4 transition-all duration-300 overflow-hidden animate-rainbow-box">
                  <div className="absolute top-0 left-0 right-0 h-1 animate-rainbow-bar" />

                  {/* Main Announcement Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black font-mono text-white uppercase tracking-wide">
                          {announcements[0].title || 'ANNOUNCEMENT'}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>DATE: {announcements[0].date}</span>
                    </span>
                  </div>

                  {/* Main Announcement Details */}
                  <div className="bg-[#050812] border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-100 leading-relaxed space-y-2">
                    <span className="text-amber-400 font-extrabold block text-[11px] uppercase tracking-wider">
                      ANNOUNCEMENT DETAILS:
                    </span>
                    <p className="text-gray-200 text-sm font-sans font-medium leading-relaxed whitespace-pre-line">
                      {announcements[0].details}
                    </p>
                  </div>

                  {/* Sub-Announcements (rendered as compact cards underneath if multiple exist) */}
                  {announcements.length > 1 && (
                    <div className="pt-4 border-t border-cyan-500/20 space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 font-bold block">
                        ADDITIONAL UPDATES ({announcements.length - 1}):
                      </span>

                      <div className="grid grid-cols-1 gap-3">
                        {announcements.slice(1).map((subAnn) => (
                          <div key={subAnn.id} className="bg-[#0b1329] border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-cyan-300 uppercase">{subAnn.title || 'UPDATE'}</span>
                              <span className="text-[11px] text-cyan-400/80 font-mono">DATE: {subAnn.date}</span>
                            </div>
                            <p className="text-gray-300 text-xs font-sans leading-relaxed whitespace-pre-line">
                              {subAnn.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STOCK ANALYSIS SECTION (Only rendered when stock technical analysis entries exist) */}
            {stockData.length > 0 && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                  <FileText className="w-4 h-4" />
                  <span>EQUITY TRADES & TECHNICAL ANALYSIS JUSTIFICATION BEFORE TAKING POSITION</span>
                </div>

                {loading && stockData.length === 0 ? (
                  <div className="flex flex-col space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 animate-pulse h-48" />
                    ))}
                  </div>
                ) : filteredStockData.length === 0 ? (
                  <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-8 text-center text-gray-400 font-mono text-xs">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    NO MATCHING STOCK TECHNICAL ANALYSIS RECORDS FOUND FOR "{searchTerm}".
                  </div>
                ) : (
                  /* Vertically stacked stock cards (one below another) */
                  <div className="flex flex-col space-y-6">
                    {filteredStockData.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-gradient-to-br from-[#0a0a0d] to-[#121217] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700" />

                        <div className="flex flex-wrap items-center justify-between gap-3">
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
                          <p className="text-gray-200 text-sm font-sans font-medium leading-relaxed whitespace-pre-line">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
