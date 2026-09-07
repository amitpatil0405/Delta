import React, { useState, useEffect } from 'react';
import { LineChart, Search, RefreshCw, Layers, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const TECHNICAL_ANALYSIS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=613914429';

// Static institutional fallback
const FALLBACK_ANALYSIS_DATA = [
  {
    id: 1,
    stockName: 'SBI card',
    description: 'Position taken in SBI card due to stock was in range'
  },
  {
    id: 2,
    stockName: 'Reliance',
    description: 'Position taken in SBI card due to stock was in range'
  }
];

export default function TechnicalAnalysisSection() {
  const [data, setData] = useState(FALLBACK_ANALYSIS_DATA);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('');

  const fetchSheetData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${TECHNICAL_ANALYSIS_SHEET_URL}&t=${Date.now()}`);
      if (response.ok) {
        const text = await response.text();
        const parsed = parseCSVRows(text);
        if (parsed && parsed.length > 0) {
          setData(parsed);
        }
      }
    } catch (e) {
      console.error('Error fetching technical analysis CSV:', e);
    } finally {
      setLoading(false);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  function parseCSVRows(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return null;

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      if (cells.length >= 3) {
        const stockName = cells[1]?.trim() || '';
        const description = cells[2]?.trim() || '';

        if (stockName || description) {
          result.push({
            id: i,
            stockName: stockName || 'UNNAMED EQUITY',
            description: description || 'No detailed analysis description provided.'
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

  const filteredData = data.filter(item => {
    const query = searchTerm.toLowerCase();
    return (
      item.stockName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
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
              SYSTEMATIC POSITION LOGIC
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              TECHNICAL ANALYSIS BEFORE TAKING POSITION.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-3xl font-light">
              Structured technical analysis, price action setups, and chart pattern justifications recorded prior to trade execution.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={fetchSheetData}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-amber-400 hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC SHEET</span>
            </button>

            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SYNCED: {lastSyncTime || 'LIVE'}</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stock name or analysis notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
            <span>TOTAL ANALYSES: <strong className="text-amber-400">{data.length}</strong></span>
            <span>FILTERED: <strong className="text-white">{filteredData.length}</strong></span>
          </div>
        </div>

        {/* Content Cards Grid */}
        {loading && data.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 animate-pulse h-40" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-12 text-center text-gray-400 font-mono text-xs">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            NO MATCHING TECHNICAL ANALYSIS RECORDS FOUND FOR "{searchTerm}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="group bg-gradient-to-br from-[#0a0a0d] to-[#121217] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden"
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                        EQUITY TICKER
                      </span>
                      <h3 className="text-xl font-extrabold font-mono text-white group-hover:text-amber-400 transition-colors uppercase">
                        {item.stockName}
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>PRE-POSITION VERIFIED</span>
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
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
