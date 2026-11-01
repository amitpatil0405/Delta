import React, { useState, useEffect } from 'react';
import { LineChart, AlertCircle, FileText, Calendar, Megaphone } from 'lucide-react';

const STOCK_TECHNICAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=613914429';

// Static fallback for Stock analysis
const FALLBACK_STOCK_DATA = [];

export default function TechnicalAnalysisSection() {
  const [stockData, setStockData] = useState(FALLBACK_STOCK_DATA);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('');

  const fetchAllSheetData = async () => {
    setLoading(true);
    try {
      // Fetch Stock Analysis & Announcements (gid=613914429)
      const stockRes = await fetch(`${STOCK_TECHNICAL_SHEET_URL}&t=${Date.now()}`);
      if (stockRes.ok) {
        const text = await stockRes.text();
        const { stocks, announcements: parsedAnnouncements } = parseStockAndAnnouncementCSV(text);
        setStockData(stocks);
        setAnnouncements(parsedAnnouncements);
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

  return (
    <section id="technical-analysis" className="relative bg-transparent bg-subpage-grid text-white scroll-mt-16 sm:scroll-mt-20 pt-8 sm:pt-10 pb-16 overflow-hidden">
      {/* Soft Ambient Radial Glow */}
      <div className="ambient-glow-amber -top-20 -left-20" />
      <div className="ambient-glow-emerald bottom-0 right-0" />

      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

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
              Systematic quantitative insights and pre-trade technical roadmaps for individual large-cap options.
            </p>
          </div>

          <div className="flex items-center self-start md:self-auto">
            <div className="flex items-center gap-2 bg-[#0a0a0c]/90 border border-amber-500/30 px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>LIVE SYNCED: {lastSyncTime || 'LIVE'}</span>
            </div>
          </div>
        </div>

        {/* STOCK ANALYSIS & ANNOUNCEMENTS SECTION */}
        <div className="space-y-6">

          {/* Loading State when both stocks and announcements are empty */}
          {loading && stockData.length === 0 && announcements.length === 0 && (
            <div className="flex flex-col space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 animate-pulse h-48" />
              ))}
            </div>
          )}

          {/* Empty State when not loading and no stock records or announcements */}
          {!loading && stockData.length === 0 && announcements.length === 0 && (
            <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-8 text-center text-gray-400 font-mono text-xs">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              NO STOCK TECHNICAL ANALYSIS RECORDS FOUND.
            </div>
          )}

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

              {/* Vertically stacked stock cards (one below another) */}
              <div className="flex flex-col space-y-6">
                {stockData.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-[#0a0a0f]/90 border border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] relative overflow-hidden"
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
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
