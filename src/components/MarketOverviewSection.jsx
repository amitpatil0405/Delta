import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
  Building2,
  CalendarDays
} from 'lucide-react';

const HOLIDAY_CSV_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=170756965';

// Fallback data matching the exact Google Sheet
const FALLBACK_HOLIDAYS = [
  { srNo: '1', dateStr: '26 January 2026', weekday: 'Monday', holiday: 'Republic Day' },
  { srNo: '2', dateStr: '3 March 2026', weekday: 'Tuesday', holiday: 'Holi' },
  { srNo: '3', dateStr: '26 March 2026', weekday: 'Thursday', holiday: 'Shri Ram Navami' },
  { srNo: '4', dateStr: '31 March 2026', weekday: 'Tuesday', holiday: 'Shri Mahavir Jayanti' },
  { srNo: '5', dateStr: '3 April 2026', weekday: 'Friday', holiday: 'Good Friday' },
  { srNo: '6', dateStr: '14 April 2026', weekday: 'Tuesday', holiday: 'Dr. Baba Saheb Ambedkar Jayanti' },
  { srNo: '7', dateStr: '01 May 2026', weekday: 'Friday', holiday: 'Maharashtra Day' },
  { srNo: '8', dateStr: '28 May 2026', weekday: 'Thursday', holiday: 'Bakri Id' },
  { srNo: '9', dateStr: '26 June 2026', weekday: 'Friday', holiday: 'Muharram' },
  { srNo: '10', dateStr: '14 September 2026', weekday: 'Monday', holiday: 'Ganesh Chaturthi' },
  { srNo: '11', dateStr: '2 October 2026', weekday: 'Friday', holiday: 'Mahatma Gandhi Jayanti' },
  { srNo: '12', dateStr: '20 October 2026', weekday: 'Tuesday', holiday: 'Dussehra' },
  { srNo: '13', dateStr: '10 November 2026', weekday: 'Tuesday', holiday: 'Diwali-Balipratipada' },
  { srNo: '14', dateStr: '24 November 2026', weekday: 'Tuesday', holiday: 'Prakash Gurpurb Sri Guru Nanak Dev' },
  { srNo: '15', dateStr: '25 December 2026', weekday: 'Friday', holiday: 'Christmas' }
];

export default function MarketOverviewSection() {
  const { marketStatus } = useMarket();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Parse date string into Date object
  const parseHolidayDate = (dateStr) => {
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      console.error('Error parsing date:', dateStr, e);
    }
    return null;
  };

  // Helper to parse CSV text
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedList = [];

    for (let i = 0; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.replace(/^"(.*)"$/, '$1').trim());
      // Skip title header row if present
      if (row.length >= 4 && !isNaN(parseInt(row[0]))) {
        parsedList.push({
          srNo: row[0],
          dateStr: row[1],
          weekday: row[2],
          holiday: row[3]
        });
      }
    }

    return parsedList.length > 0 ? parsedList : FALLBACK_HOLIDAYS;
  };

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${HOLIDAY_CSV_URL}&t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to fetch holiday calendar');
      const text = await res.text();
      const parsed = parseCSV(text);
      setHolidays(parsed);
    } catch (err) {
      console.warn('Using fallback holiday calendar data:', err);
      setHolidays(FALLBACK_HOLIDAYS);
    } finally {
      setLoading(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Determine current date & find next upcoming holiday
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const processedHolidays = (holidays.length > 0 ? holidays : FALLBACK_HOLIDAYS).map(item => {
    const d = parseHolidayDate(item.dateStr);
    const isPast = d ? d < today : false;
    const isToday = d ? d.getTime() === today.getTime() : false;

    // Calculate days remaining
    let daysDiff = null;
    if (d) {
      const diffTime = d.getTime() - today.getTime();
      daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return { ...item, dateObj: d, isPast, isToday, daysDiff };
  });

  // Next upcoming holiday (first holiday where dateObj >= today)
  const upcomingHoliday = processedHolidays.find(h => h.dateObj && h.dateObj >= today) || processedHolidays[processedHolidays.length - 1];

  return (
    <section id="intelligence" className="relative bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              NSE / BSE TRADING SCHEDULE & SCHEDULED CLOSURES
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              INDIAN STOCK MARKET HOLIDAY CALENDAR.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Official NSE & BSE equity, F&O, and currency derivative market settlement closures synchronized live.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchHolidays}
              disabled={loading}
              className="flex items-center space-x-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC CALENDAR</span>
            </button>
            <div className="flex items-center gap-2 bg-[#111111] border border-[#222222] px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SYNCED: {lastSyncTime || 'LIVE'}</span>
            </div>
          </div>
        </div>

        {/* Highlighted Upcoming Holiday Hero Banner */}
        {upcomingHoliday && (
          <div className="relative bg-gradient-to-r from-[#121217] via-[#1a1712] to-[#121217] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NEXT UPCOMING MARKET HOLIDAY</span>
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    EQUITY & DERIVATIVE SEGMENTS CLOSED
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                    {upcomingHoliday.holiday}
                  </h3>
                  <span className="text-amber-400 font-mono font-bold text-lg sm:text-xl">
                    {upcomingHoliday.dateStr} ({upcomingHoliday.weekday})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-2xl leading-relaxed">
                  Trading across NSE & BSE Cash Equities, Futures & Options (F&O), Currency Derivatives, and SLB segments remains suspended. Normal market clearing and trade settlement will resume on the following business day.
                </p>
              </div>

              {/* Countdown / Status Box */}
              <div className="shrink-0 bg-neutral-900/90 border border-amber-500/30 p-5 rounded-2xl text-center min-w-[220px]">
                {upcomingHoliday.isToday ? (
                  <div>
                    <span className="text-rose-500 font-black text-2xl font-mono block uppercase">MARKET CLOSED TODAY</span>
                    <span className="text-xs text-gray-400 font-mono mt-1 block">Happy {upcomingHoliday.holiday}!</span>
                  </div>
                ) : upcomingHoliday.daysDiff !== null ? (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400 block mb-1">
                      TIME UNTIL CLOSURE
                    </span>
                    <div className="flex items-baseline justify-center space-x-1 font-mono">
                      <span className="text-4xl sm:text-5xl font-black text-amber-400">
                        {upcomingHoliday.daysDiff}
                      </span>
                      <span className="text-sm font-bold text-gray-300">
                        {upcomingHoliday.daysDiff === 1 ? 'DAY' : 'DAYS'}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono block mt-1">
                      {upcomingHoliday.daysDiff === 0 ? 'Holiday is tomorrow' : `Approaching on ${upcomingHoliday.weekday}`}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-amber-400 font-mono font-bold text-lg">{upcomingHoliday.dateStr}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Main Holiday Calendar Table & Grid View */}
        <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-white uppercase">
                  COMPLETE 2026 TRADING HOLIDAY SCHEDULE
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Official list of 15 scheduled stock exchange holidays
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Past ({processedHolidays.filter(h => h.isPast).length})</span>
              </span>
              <span className="mx-1">•</span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Upcoming ({processedHolidays.filter(h => !h.isPast).length})</span>
              </span>
            </div>
          </div>

          {/* Desktop & Mobile Table View */}
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#050505]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/90 text-amber-400 font-mono text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="py-3.5 px-4 font-bold text-center w-16">SR. NO.</th>
                  <th className="py-3.5 px-4 font-bold">DATE</th>
                  <th className="py-3.5 px-4 font-bold">DAY</th>
                  <th className="py-3.5 px-4 font-bold">HOLIDAY OCCASION</th>
                  <th className="py-3.5 px-4 font-bold text-right">TRADING STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {processedHolidays.map((item) => {
                  const isNextUpcoming = upcomingHoliday && upcomingHoliday.srNo === item.srNo;
                  return (
                    <tr
                      key={item.srNo}
                      className={`transition-colors ${
                        isNextUpcoming
                          ? 'bg-amber-500/10 border-l-4 border-l-amber-400 font-bold'
                          : item.isPast
                          ? 'opacity-50 hover:bg-white/[0.02]'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <td className="py-4 px-4 text-center font-bold text-gray-400">
                        {item.srNo}
                      </td>

                      <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                        {item.dateStr}
                      </td>

                      <td className="py-4 px-4 text-gray-300">
                        {item.weekday}
                      </td>

                      <td className="py-4 px-4 text-gray-100 font-sans text-sm font-semibold">
                        {item.holiday}
                        {isNextUpcoming && (
                          <span className="ml-2.5 inline-block text-[10px] font-mono font-bold uppercase bg-amber-400 text-black px-2 py-0.5 rounded">
                            NEXT HOLIDAY
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {item.isPast ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-neutral-800 text-gray-400 border border-neutral-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>COMPLETED</span>
                          </span>
                        ) : isNextUpcoming ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>UPCOMING ({item.daysDiff} DAYS)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <span>SCHEDULED</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="flex items-start space-x-3 bg-neutral-900/60 border border-white/5 p-4 rounded-xl text-xs text-gray-400 font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Note on Trading Timings:</strong> On scheduled holidays, Trading in Equity, F&O, Currency Derivatives, and Interest Rate Derivatives remains closed for the entire day. Muhurat Trading timings for Diwali will be notified separately by NSE/BSE.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
