import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Indices',
    stocks: [
      { symbol: 'NIFTY 50', name: 'NIFTY 50 Index', price: 24055.80, change: 185.40, pChange: 0.78, high: 24120.50, low: 23880.20, volume: '1.4B' },
      { symbol: 'BANK NIFTY', name: 'NIFTY Bank', price: 57409.60, change: 345.20, pChange: 0.61, high: 57580.00, low: 57020.10, volume: '910M' },
      { symbol: 'SENSEX', name: 'BSE SENSEX', price: 79250.40, change: 580.60, pChange: 0.74, high: 79410.10, low: 78620.00, volume: '1.1B' }
    ]
  },
  {
    sectorName: 'Energy & Heavy Weight',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1285.40, change: 14.10, pChange: 1.11, high: 1292.00, low: 1270.00, volume: '12.4M' },
      { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 3840.25, change: 55.80, pChange: 1.47, high: 3855.00, low: 3785.00, volume: '2.9M' }
    ]
  },
  {
    sectorName: 'Technology & IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4420.15, change: 42.50, pChange: 0.97, high: 4440.00, low: 4385.00, volume: '3.8M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1885.80, change: 18.20, pChange: 0.97, high: 1895.00, low: 1865.00, volume: '6.1M' }
    ]
  },
  {
    sectorName: 'Banking & Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1745.30, change: 22.60, pChange: 1.31, high: 1752.00, low: 1720.00, volume: '15.2M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1288.90, change: 14.40, pChange: 1.13, high: 1294.00, low: 1275.00, volume: '10.5M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 862.50, change: 8.10, pChange: 0.95, high: 868.00, low: 852.00, volume: '18.3M' }
    ]
  },
  {
    sectorName: 'Telecom, FMCG & Auto',
    stocks: [
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1620.40, change: 24.20, pChange: 1.52, high: 1628.00, low: 1598.00, volume: '7.9M' },
      { symbol: 'ITC', name: 'ITC Limited', price: 478.60, change: 5.30, pChange: 1.12, high: 481.00, low: 473.80, volume: '11.8M' },
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 11480.00, change: 110.00, pChange: 0.97, high: 11520.00, low: 11380.00, volume: '880K' }
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
