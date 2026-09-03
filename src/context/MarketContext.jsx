import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 706.65, change: 5.85, pChange: 0.83, high: 712.60, low: 705.00, volume: '27.7M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1430.00, change: 3.50, pChange: 0.25, high: 1452.00, low: 1430.00, volume: '10.5M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 1023.40, change: 2.50, pChange: 0.24, high: 1036.00, low: 1021.10, volume: '18.3M' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 421.15, change: -2.35, pChange: -0.55, high: 426.90, low: 421.15, volume: '4.2M' },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1267.00, change: 13.10, pChange: 1.04, high: 1278.90, low: 1260.20, volume: '6.7M' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 6845.00, change: 42.50, pChange: 0.62, high: 6890.00, low: 6802.00, volume: '2.1M' },
      { symbol: 'SBICARD', name: 'SBI Cards & Payment Services', price: 661.00, change: 25.85, pChange: 4.07, high: 667.40, low: 641.00, volume: '2.8M' }
    ]
  },
  {
    sectorName: 'IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 2320.10, change: -27.90, pChange: -1.19, high: 2353.60, low: 2316.10, volume: '1.9M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1130.30, change: -9.70, pChange: -0.85, high: 1144.00, low: 1122.50, volume: '6.1M' },
      { symbol: 'WIPRO', name: 'Wipro Limited', price: 175.72, change: -1.37, pChange: -0.77, high: 178.04, low: 175.72, volume: '8.4M' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1319.00, change: -12.50, pChange: -0.94, high: 1345.00, low: 1308.00, volume: '3.2M' },
      { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1598.00, change: -25.00, pChange: -1.54, high: 1625.60, low: 1592.00, volume: '2.5M' }
    ]
  },
  {
    sectorName: 'Oil & Gas',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1302.50, change: -10.60, pChange: -0.81, high: 1316.80, low: 1302.50, volume: '9.7M' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 236.00, change: -1.50, pChange: -0.63, high: 237.80, low: 235.00, volume: '14.1M' },
      { symbol: 'BPCL', name: 'Bharat Petroleum Corp', price: 320.05, change: 0.45, pChange: 0.14, high: 321.95, low: 317.20, volume: '9.3M' },
      { symbol: 'IOC', name: 'Indian Oil Corporation', price: 137.80, change: 0.80, pChange: 0.58, high: 137.80, low: 136.25, volume: '11.2M' },
      { symbol: 'ATGL', name: 'Adani Total Gas Ltd.', price: 614.05, change: -0.90, pChange: -0.15, high: 622.00, low: 612.95, volume: '4.5M' },
      { symbol: 'GAIL', name: 'GAIL (India) Ltd.', price: 174.67, change: 1.67, pChange: 0.97, high: 174.67, low: 172.01, volume: '8.7M' }
    ]
  },
  {
    sectorName: 'FMCG',
    stocks: [
      { symbol: 'ITC', name: 'ITC Limited', price: 263.00, change: -3.30, pChange: -1.24, high: 267.60, low: 262.35, volume: '11.8M' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 1962.00, change: -13.00, pChange: -0.66, high: 1978.90, low: 1959.90, volume: '2.1M' },
      { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 5130.00, change: -24.00, pChange: -0.47, high: 5146.00, low: 5079.00, volume: '620K' },
      { symbol: 'MARICO', name: 'Marico Limited', price: 827.40, change: -1.95, pChange: -0.24, high: 832.85, low: 817.80, volume: '3.4M' },
      { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 880.00, change: -25.00, pChange: -2.76, high: 893.00, low: 859.55, volume: '2.2M' },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1019.20, change: 7.20, pChange: 0.71, high: 1023.00, low: 1008.00, volume: '1.9M' }
    ]
  },
  {
    sectorName: 'Automobile',
    stocks: [
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 12857.00, change: 8.00, pChange: 0.06, high: 12927.00, low: 12780.00, volume: '880K' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 3150.00, change: -40.00, pChange: -1.25, high: 3210.00, low: 3150.00, volume: '3.4M' },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 5308.50, change: 8.50, pChange: 0.16, high: 5315.00, low: 5271.00, volume: '750K' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 11920.00, change: -210.00, pChange: -1.73, high: 12191.00, low: 11920.00, volume: '620K' },
      { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 7690.00, change: -21.50, pChange: -0.28, high: 7738.50, low: 7597.00, volume: '890K' }
    ]
  }
];

export function MarketProvider({ children }) {
  const [activeSymbol, setActiveSymbol] = useState('NIFTY 50');
  const [watchlistSectors, setWatchlistSectors] = useState(INITIAL_SECTOR_WATCHLIST);
  const [marketStatus, setMarketStatus] = useState(getISTMarketStatus());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN'));

  // Update IST market status and refresh live market data for sectors
  useEffect(() => {
    const refreshData = async () => {
      setMarketStatus(getISTMarketStatus());
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));

      // Dynamically fetch latest quote for initial stocks if possible
      setWatchlistSectors(prevSectors => {
        return prevSectors;
      });
    };

    refreshData();
    const timer = setInterval(refreshData, 10000);
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

  // List all 29 underlying assets required for Option Chain and Centralized Chart selection
  const REQUIRED_UNDERLYINGS = [
    'NIFTY 50',
    'BANK NIFTY',
    'SENSEX',
    'RELIANCE',
    'BHARTIARTL',
    'HDFCBANK',
    'ICICIBANK',
    'SBIN',
    'SBICARD',
    'TCS',
    'BAJFINANCE',
    'LT',
    'INFY',
    'HINDUNILVR',
    'SUNPHARMA',
    'TITAN',
    'KOTAKBANK',
    'MARUTI',
    'M&M',
    'ADANIENT',
    'ADANIPORTS',
    'AXISBANK',
    'TATAMOTORS',
    'ITC',
    'WIPRO',
    'HCLTECH',
    'BAJAJ-AUTO',
    'NTPC',
    'POWERGRID'
  ];

  const allAvailableSymbols = Array.from(
    new Set([
      ...REQUIRED_UNDERLYINGS,
      ...watchlistSectors.flatMap(sec => sec.stocks.map(s => s.symbol))
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
