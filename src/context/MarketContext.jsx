import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1745.30, change: 22.60, pChange: 1.31, high: 1752.00, low: 1720.00, volume: '15.2M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1288.90, change: 14.40, pChange: 1.13, high: 1294.00, low: 1275.00, volume: '10.5M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 862.50, change: 8.10, pChange: 0.95, high: 868.00, low: 852.00, volume: '18.3M' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1780.20, change: 12.50, pChange: 0.71, high: 1795.00, low: 1765.00, volume: '4.2M' },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1165.40, change: 9.80, pChange: 0.85, high: 1172.00, low: 1150.00, volume: '6.7M' },
      { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', price: 1610.20, change: 18.40, pChange: 1.16, high: 1625.00, low: 1595.00, volume: '3.1M' },
      { symbol: 'SBICARD', name: 'SBI Cards & Payment Services', price: 710.50, change: 6.80, pChange: 0.97, high: 718.00, low: 702.00, volume: '2.8M' }
    ]
  },
  {
    sectorName: 'IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4420.15, change: 42.50, pChange: 0.97, high: 4440.00, low: 4385.00, volume: '3.8M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1885.80, change: 18.20, pChange: 0.97, high: 1895.00, low: 1865.00, volume: '6.1M' },
      { symbol: 'WIPRO', name: 'Wipro Limited', price: 540.25, change: 5.10, pChange: 0.95, high: 546.00, low: 532.00, volume: '8.4M' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1785.60, change: 21.40, pChange: 1.21, high: 1798.00, low: 1760.00, volume: '3.2M' },
      { symbol: 'LTM', name: 'LTIMindtree Limited', price: 5420.30, change: 62.10, pChange: 1.16, high: 5460.00, low: 5380.00, volume: '1.4M' },
      { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1610.90, change: 15.30, pChange: 0.96, high: 1625.00, low: 1590.00, volume: '2.5M' }
    ]
  },
  {
    sectorName: 'Oil & Gas',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1285.40, change: 14.10, pChange: 1.11, high: 1292.00, low: 1270.00, volume: '12.4M' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 298.50, change: 3.20, pChange: 1.08, high: 302.00, low: 294.00, volume: '14.1M' },
      { symbol: 'BPCL', name: 'Bharat Petroleum Corp', price: 345.80, change: 4.10, pChange: 1.20, high: 349.00, low: 340.00, volume: '9.3M' },
      { symbol: 'IOC', name: 'Indian Oil Corporation', price: 172.40, change: 1.80, pChange: 1.05, high: 175.00, low: 169.50, volume: '11.2M' },
      { symbol: 'ATGL', name: 'Adani Total Gas Ltd.', price: 810.40, change: 9.50, pChange: 1.19, high: 822.00, low: 798.00, volume: '4.5M' },
      { symbol: 'GAIL', name: 'GAIL (India) Ltd.', price: 215.60, change: 2.90, pChange: 1.36, high: 218.00, low: 211.00, volume: '8.7M' }
    ]
  },
  {
    sectorName: 'FMCG',
    stocks: [
      { symbol: 'ITC', name: 'ITC Limited', price: 478.60, change: 5.30, pChange: 1.12, high: 481.00, low: 473.80, volume: '11.8M' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2540.20, change: 28.40, pChange: 1.13, high: 2560.00, low: 2515.00, volume: '2.1M' },
      { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 5680.50, change: 65.20, pChange: 1.16, high: 5710.00, low: 5610.00, volume: '620K' },
      { symbol: 'MARICO', name: 'Marico Limited', price: 620.40, change: 7.10, pChange: 1.16, high: 628.00, low: 612.00, volume: '3.4M' },
      { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 1240.80, change: 14.20, pChange: 1.16, high: 1255.00, low: 1225.00, volume: '2.2M' },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1120.40, change: 12.10, pChange: 1.09, high: 1130.00, low: 1105.00, volume: '1.9M' }
    ]
  },
  {
    sectorName: 'Automobile',
    stocks: [
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 11480.00, change: 110.00, pChange: 0.97, high: 11520.00, low: 11380.00, volume: '880K' },
      { symbol: 'TMPV', name: 'Tata Motors PV', price: 980.50, change: 12.80, pChange: 1.32, high: 992.00, low: 965.00, volume: '16.5M' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 2940.60, change: 35.20, pChange: 1.21, high: 2965.00, low: 2900.00, volume: '3.4M' },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 5210.40, change: 58.10, pChange: 1.13, high: 5250.00, low: 5140.00, volume: '750K' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 9150.00, change: 95.00, pChange: 1.05, high: 9220.00, low: 9060.00, volume: '620K' },
      { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 4890.30, change: 52.60, pChange: 1.09, high: 4920.00, low: 4820.00, volume: '890K' }
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

  // List all available unique symbols including indices and sector equities
  const INDEX_SYMBOLS = ['NIFTY 50', 'BANK NIFTY', 'SENSEX', 'NIFTY IT', 'NIFTY FIN SERVICE', 'NIFTY MIDCAP 100'];
  const ADDITIONAL_STOCKS = ['BHARTIARTL', 'SUNPHARMA', 'ADANIENT', 'ADANIPORTS', 'NTPC', 'POWERGRID'];

  const allAvailableSymbols = Array.from(
    new Set([
      ...INDEX_SYMBOLS,
      ...watchlistSectors.flatMap(sec => sec.stocks.map(s => s.symbol)),
      ...ADDITIONAL_STOCKS
    ])
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
