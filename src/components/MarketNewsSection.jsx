import React, { useState, useEffect } from 'react';
import { getLatestNews, NEWS_CATEGORIES } from '../services/newsData';
import { ExternalLink, RefreshCw, Newspaper } from 'lucide-react';

export default function MarketNewsSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await getLatestNews(activeCategory);
      if (res.success && res.data) {
        setNewsList(res.data);
        setLastUpdated(res.lastUpdated || new Date().toLocaleTimeString('en-IN'));
      }
    } catch (e) {
      console.error('Error loading market news:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Auto-refresh news every 3 hours (3 * 3600 * 1000 ms = 10800000 ms)
    const THREE_HOURS_MS = 3 * 3600 * 1000;
    const interval = setInterval(() => {
      fetchNews();
    }, THREE_HOURS_MS);

    return () => clearInterval(interval);
  }, [activeCategory]);

  return (
    <section id="news" className="bg-[#050505] text-white scroll-mt-20 pt-8 sm:pt-10 pb-16 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e5a93c] tracking-widest uppercase mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              REAL-TIME MARKET INTELLIGENCE
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              LIVE MARKET NEWS
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Verified financial, F&O, macro-economic, and corporate developments updated automatically every 3 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchNews}
              className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#1f1f1f] border border-[#222222] hover:border-[#e5a93c]/50 px-3.5 py-1.5 rounded-md text-xs font-mono text-gray-300 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#e5a93c] ${loading ? 'animate-spin' : ''}`} />
              <span>REFRESH</span>
            </button>
            <div className="bg-[#111111] border border-[#222222] px-3.5 py-1.5 rounded-md text-xs font-mono text-gray-400">
              UPDATED: <span className="text-white font-bold">{lastUpdated || 'RECENT'}</span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {NEWS_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#e5a93c] text-black border-[#e5a93c] shadow-[0_0_15px_rgba(229,169,60,0.3)]'
                    : 'bg-[#0a0a0a] text-gray-300 border-[#1f1f1f] hover:border-gray-600 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* News Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-[#1f1f1f] w-1/3 rounded mb-4"></div>
                  <div className="h-6 bg-[#1f1f1f] w-full rounded mb-3"></div>
                  <div className="h-4 bg-[#1f1f1f] w-2/3 rounded"></div>
                </div>
                <div className="h-8 bg-[#1f1f1f] w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#e5a93c]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,169,60,0.1)] group"
              >
                <div>
                  {/* Category & Time */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#181818] text-[#e5a93c] border border-[#e5a93c]/30">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      {item.displayTime}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-base font-bold text-white group-hover:text-[#e5a93c] transition-colors leading-snug mb-3 line-clamp-2">
                    {item.headline}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-3 mb-6">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Source & Direct Article Read More Link */}
                <div className="pt-4 border-t border-[#181818] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-500 font-medium truncate max-w-[140px]">
                    {item.source}
                  </span>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-[#e5a93c] text-[#e5a93c] hover:text-black font-mono font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all"
                  >
                    <span>READ MORE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl">
            <p className="text-gray-400 font-mono text-sm">No market news articles found for "{activeCategory}".</p>
          </div>
        )}

      </div>
    </section>
  );
}
