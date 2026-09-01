import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Indices',
    stocks: [
      { symbol: 'NIFTY 50', name: 'NIFTY 50 Index', price: 22123.65, change: 142.30, pChange: 0.65, high: 22180.50, low: 21980.20, volume: '1.2B' },
      { symbol: 'BANK NIFTY', name: 'NIFTY Bank', price: 46588.40, change: -120.15, pChange: -0.26, high: 46890.00, low: 46420.10, volume: '840M' },
      { symbol: 'SENSEX', name: 'BSE SENSEX', price: 72831.94, change: 415.80, pChange: 0.58, high: 72980.10, low: 72410.00, volume: '950M' }
    ]
  },
  {
    sectorName: 'Energy & Heavy Weight',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2985.40, change: 24.10, pChange: 0.81, high: 2998.00, low: 2960.00, volume: '6.4M' },
      { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 3640.25, change: 45.80, pChange: 1.27, high: 3655.00, low: 3595.00, volume: '1.9M' }
    ]
  },
  {
    sectorName: 'Technology & IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.15, change: 38.50, pChange: 0.94, high: 4140.00, low: 4085.00, volume: '2.8M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1645.80, change: -8.20, pChange: -0.50, high: 1662.00, low: 1640.00, volume: '4.1M' }
    ]
  },
  {
    sectorName: 'Banking & Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1445.30, change: 12.60, pChange: 0.88, high: 1452.00, low: 1430.00, volume: '11.2M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1088.90, change: 9.40, pChange: 0.87, high: 1094.00, low: 1078.00, volume: '8.5M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 762.50, change: -4.10, pChange: -0.53, high: 770.00, low: 759.00, volume: '14.3M' }
    ]
  },
  {
    sectorName: 'Telecom, FMCG & Auto',
    stocks: [
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1220.40, change: 18.20, pChange: 1.51, high: 1228.00, low: 1202.00, volume: '5.9M' },
      { symbol: 'ITC', name: 'ITC Limited', price: 418.60, change: 2.30, pChange: 0.55, high: 421.00, low: 415.80, volume: '9.8M' },
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 12480.00, change: -110.00, pChange: -0.87, high: 12620.00, low: 12440.00, volume: '480K' }
    ]
  }
];

export function MarketProvider({ children }) {
  const [activeSymbol, setActiveSymbol] = useState('NIFTY 50');
  const [watchlistSectors, setWatchlistSectors] = useState(INITIAL_SECTOR_WATCHLIST);
  const [marketStatus, setMarketStatus] = useState(getISTMarketStatus());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN'));

  // Update IST market status every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketStatus(getISTMarketStatus());
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Add stock to sector
  const addStockToWatchlist = async (sectorName, symbolInput) => {
    const symbolUpper = symbolInput.trim().toUpperCase();
    if (!symbolUpper) return false;

    // Fetch quote for symbol
    const quoteRes = await getQuote(symbolUpper);
    const stockData = quoteRes.data;

    setWatchlistSectors(prevSectors => {
      let targetSectorExists = false;
      const newSectors = prevSectors.map(sec => {
        if (sec.sectorName.toLowerCase() === sectorName.toLowerCase()) {
          targetSectorExists = true;
          // Avoid duplicate symbol in same sector
          const exists = sec.stocks.some(s => s.symbol === symbolUpper);
          if (exists) return sec;
          return {
            ...sec,
            stocks: [...sec.stocks, stockData]
          };
        }
        return sec;
      });

      if (!targetSectorExists) {
        newSectors.push({
          sectorName,
          stocks: [stockData]
        });
      }
      return newSectors;
    });

    return true;
  };

  // Remove stock from sector
  const removeStockFromWatchlist = (sectorName, symbol) => {
    setWatchlistSectors(prevSectors => {
      return prevSectors.map(sec => {
        if (sec.sectorName === sectorName) {
          return {
            ...sec,
            stocks: sec.stocks.filter(s => s.symbol !== symbol)
          };
        }
        return sec;
      }).filter(sec => sec.stocks.length > 0); // Keep sector unless completely empty if desired
    });
  };

  // List all available unique symbols across sectors
  const allAvailableSymbols = Array.from(
    new Set(
      watchlistSectors.flatMap(sec => sec.stocks.map(s => s.symbol))
    )
  );

  return (
    <MarketContext.Provider
      value={{
        activeSymbol,
        setActiveSymbol,
        watchlistSectors,
        addStockToWatchlist,
        removeStockFromWatchlist,
        allAvailableSymbols,
        marketStatus,
        lastUpdated
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
