import React, { useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';

export default function InteractiveMarketChart() {
  const { activeSymbol, setActiveSymbol, allAvailableSymbols } = useMarket();
  const containerRef = useRef(null);

  // Convert internal symbol name to TradingView symbol format
  const getTvSymbol = (sym) => {
    const uppercase = sym.toUpperCase();
    if (uppercase === 'NIFTY 50' || uppercase === 'NIFTY') return 'NSE:NIFTY';
    if (uppercase === 'BANK NIFTY' || uppercase === 'BANKNIFTY') return 'NSE:BANKNIFTY';
    if (uppercase === 'SENSEX') return 'BSE:SENSEX';
    if (uppercase === 'NIFTY IT') return 'NSE:CNXIT';
    if (uppercase === 'NIFTY FIN SERVICE') return 'NSE:CNXFINANCE';
    if (uppercase === 'NIFTY MIDCAP 100') return 'NSE:CNXMIDCAP';
    return `NSE:${uppercase}`;
  };

  const currentTvSymbol = getTvSymbol(activeSymbol);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetHolder = document.createElement('div');
    widgetHolder.className = 'tradingview-widget-container__widget';
    widgetHolder.style.height = 'calc(100% - 32px)';
    widgetHolder.style.width = '100%';

    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/symbols/${currentTvSymbol.replace(':', '-')}/" rel="noopener nofollow" target="_blank"><span class="blue-text">${activeSymbol} chart</span></a><span class="trademark"> by TradingView</span>`;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;

    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: currentTvSymbol,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(242, 242, 242, 0.2)",
      watchlist: [
        "NSE:RELIANCE",
        "NSE:TCS",
        "NSE:M&M",
        "NSE:TECHM",
        "NSE:WIPRO",
        "NSE:SBICARD",
        "NSE:INFY"
      ],
      withdateranges: false,
      compareSymbols: [],
      support_host: "https://www.tradingview.com",
      studies: [],
      autosize: true
    });

    widgetContainer.appendChild(widgetHolder);
    widgetContainer.appendChild(copyrightDiv);
    widgetContainer.appendChild(script);

    containerRef.current.appendChild(widgetContainer);
  }, [activeSymbol, currentTvSymbol]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-500/30 shadow-[0_0_30px_rgba(217,119,6,0.15)] relative overflow-hidden">

      {/* Control Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
            ADVANCED TRADING TERMINAL
          </span>
          <h3 className="text-xl font-extrabold text-white font-mono">
            {activeSymbol} LIVE CHART
          </h3>
        </div>

        <div className="flex items-center space-x-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-amber-500/40">
          <span className="text-[11px] font-mono text-gray-400">SELECT ASSET:</span>
          <select
            value={activeSymbol}
            onChange={(e) => setActiveSymbol(e.target.value)}
            className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
          >
            {allAvailableSymbols.map((sym) => (
              <option key={sym} value={sym} className="bg-neutral-900 text-white">
                {sym}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TradingView Advanced Chart Container */}
      <div ref={containerRef} className="h-[520px] w-full" />

    </div>
  );
}
