import React, { useEffect, useState } from 'react';
import { BarChart3, ChevronRight, BookOpen, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { getIndices, getQuote } from '../services/marketData';
import { useMarket } from '../context/MarketContext';

const OPTION_CHAIN_TICKER_SYMBOLS = [
  'NIFTY 50', 'BANK NIFTY', 'SENSEX', 'NIFTY IT', 'NIFTY FIN SERVICE', 'NIFTY MIDCAP 100',
  'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'SBICARD', 'TCS', 'INFY', 'BHARTIARTL',
  'BAJFINANCE', 'LT', 'HINDUNILVR', 'SUNPHARMA', 'TITAN', 'KOTAKBANK', 'MARUTI',
  'M&M', 'ADANIENT', 'ADANIPORTS', 'AXISBANK', 'TATAMOTORS', 'ITC', 'WIPRO',
  'HCLTECH', 'BAJAJ-AUTO', 'NTPC', 'POWERGRID'
];

export default function HeroSection({ onExplorePortfolio, onExploreStrategies }) {
  const [loaded, setLoaded] = useState(false);
  const [tickerItems, setTickerItems] = useState([]);
  const [tickerLoading, setTickerLoading] = useState(true);
  const { setActiveSymbol } = useMarket();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch prices for all option chain symbols
  useEffect(() => {
    let isMounted = true;

    const fetchTickerData = async () => {
      try {
        // Fetch baseline indices
        const indicesRes = await getIndices();
        const indicesData = indicesRes.success ? indicesRes.data : [];

        // Fetch quotes for remaining equity stocks
        const items = await Promise.all(
          OPTION_CHAIN_TICKER_SYMBOLS.map(async (sym) => {
            const foundIndex = indicesData.find(idx => idx.symbol === sym);
            if (foundIndex) {
              return {
                symbol: foundIndex.symbol,
                price: foundIndex.price,
                change: foundIndex.change,
                pChange: foundIndex.pChange,
                isIndex: true
              };
            }
            const q = await getQuote(sym);
            if (q.success && q.data) {
              return {
                symbol: q.data.symbol,
                price: q.data.price,
                change: q.data.change,
                pChange: q.data.pChange,
                isIndex: false
              };
            }
            return null;
          })
        );

        if (isMounted) {
          const validItems = items.filter(Boolean);
          setTickerItems(validItems);
          setTickerLoading(false);
        }
      } catch (err) {
        console.error('Error loading hero ticker data:', err);
      }
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 15000); // refresh every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[85vh] pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden bg-transparent">

      {/* Hero Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Viewport Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center">

        {/* Animated Brand Badge */}
        <div
          className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-8 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Systematic Options Trading & Portfolio Intelligence</span>
        </div>

        {/* Main Brand Title & Headings */}
        <h1
          className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl leading-[1.1] transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Where Risk Meets Reward,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 font-serif italic">
            Intelligently.
          </span>
        </h1>

        <p
          className={`mt-6 text-base sm:text-xl text-gray-400 font-medium tracking-wide max-w-3xl transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Systematic Options Trading • Portfolio Journal • Risk Management
        </p>

        <p
          className={`mt-6 text-sm sm:text-base text-gray-400/90 leading-relaxed max-w-3xl transition-all duration-700 delay-300 font-normal ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          At DeltaFox, we bridge the gap between structural engineering precision and institutional-grade financial markets. Founded on the core principles of non-directional probability, mathematical risk management, and rigorous capital preservation, we transform complex options trading into a disciplined, systematic science.
        </p>

        {/* Interactive CTA Buttons */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto transition-all duration-700 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={onExplorePortfolio}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(217,119,6,0.4)] flex items-center justify-center space-x-3 group active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span>VIEW TRADING PORTFOLIO</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreStrategies}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase text-gray-200 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center space-x-3 group active:scale-95"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>OUR STRATEGIES</span>
          </button>
        </div>

        {/* Live Option Chain Underlyings Rotating Ticker */}
        <div
          className={`mt-12 w-full max-w-6xl transition-all duration-1000 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-[#0a0a0a]/90 border border-amber-500/20 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl shadow-amber-950/20 overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-2 border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 tracking-wider uppercase">
                <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span className="font-bold">OPTION CHAIN LIVE MARKET TICKER</span>
                <span className="hidden sm:inline-block text-[10px] text-gray-500 font-normal">
                  • Real-Time Spot & Equity Quotes
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400 font-semibold uppercase">LIVE IST AGGREGATOR</span>
              </div>
            </div>

            {/* Slow Rotating Marquee Container */}
            <div className="relative w-full overflow-hidden group">
              {/* Fade Edges for Premium Look */}
              <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

              {tickerLoading ? (
                <div className="py-2 text-center text-xs font-mono text-gray-500 tracking-widest animate-pulse">
                  LOADING OPTION CHAIN LIVE PRICES...
                </div>
              ) : (
                <div className="flex w-max animate-slow-marquee hover:[animation-play-state:paused] space-x-6 sm:space-x-8 py-1.5">
                  {/* Render ticker items twice for seamless infinite smooth scrolling */}
                  {[...tickerItems, ...tickerItems].map((item, idx) => {
                    const isPositive = item.change >= 0;
                    return (
                      <div
                        key={`${item.symbol}-${idx}`}
                        onClick={() => {
                          setActiveSymbol(item.symbol);
                          const optionsElem = document.getElementById('options');
                          if (optionsElem) optionsElem.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center space-x-2.5 bg-[#141414]/80 border border-white/5 hover:border-amber-500/50 hover:bg-[#1f1f1f] px-3.5 py-1.5 rounded-xl transition-all duration-300 cursor-pointer shrink-0 group/item shadow-sm"
                      >
                        <span className="text-xs font-mono font-bold text-gray-200 group-hover/item:text-amber-400 transition-colors">
                          {item.symbol}
                        </span>

                        <span className="text-xs font-mono font-extrabold text-white">
                          ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>

                        <span
                          className={`flex items-center text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                            isPositive
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-red-400 bg-red-500/10 border border-red-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 mr-1 inline-block" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1 inline-block" />
                          )}
                          {isPositive ? '+' : ''}
                          {item.pChange.toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
