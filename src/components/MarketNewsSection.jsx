import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import { getLatestNews, NEWS_CATEGORIES } from '../services/newsData';

export default function MarketNewsSection() {
  const [newsList, setNewsList] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadNews = async (cat) => {
    setLoading(true);
    const res = await getLatestNews(cat);
    if (res.success) {
      setNewsList(res.data);
      setLastUpdated(res.lastUpdated || new Date().toLocaleTimeString('en-IN'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNews(category);

    // Auto update news every 2 hours (2 * 60 * 60 * 1000 ms)
    const interval = setInterval(() => {
      loadNews(category);
    }, 7200000);

    return () => clearInterval(interval);
  }, [category]);

  return (
    <section id="news" className="py-20 bg-[#060608] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Newspaper className="w-4 h-4" />
              <span>Verified Market Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              LIVE MARKET NEWS & INSIGHTS
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Curated, verified financial headlines, regulatory updates, macroeconomic releases, and earnings insights.
            </p>
          </div>

          <button
            onClick={() => loadNews(category)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-mono font-bold text-gray-300 hover:text-white bg-neutral-900 border border-white/10 rounded-lg hover:border-amber-500/40 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>REFRESH NEWS</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'bg-neutral-900/80 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="py-20 text-center text-amber-400 font-mono text-sm animate-pulse">
            FETCHING LIVE MARKET HEADLINES & REGULATORY FEEDS...
          </div>
        ) : newsList.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-gray-400 font-mono text-sm">
            DATA UNAVAILABLE FOR THIS CATEGORY AT THIS MOMENT.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-[0_10px_25px_rgba(217,119,6,0.1)] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase font-bold">
                      {item.category}
                    </span>
                    <span className="text-gray-500">{item.displayTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {item.headline}
                  </h3>

                  <p className="mt-3 text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-500 text-[11px] font-semibold">{item.source}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold group/link"
                  >
                    <span>Read Details</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
