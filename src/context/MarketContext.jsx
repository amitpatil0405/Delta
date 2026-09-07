import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 709.40, open: 713.00, change: -2.50, pChange: -0.35, high: 713.00, low: 708.75, volume: '27.7M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1427.30, open: 1434.40, change: -10.70, pChange: -0.74, high: 1434.40, low: 1423.40, volume: '10.5M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 1003.60, open: 1021.70, change: -30.90, pChange: -2.99, high: 1021.70, low: 1003.20, volume: '18.3M' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1780.50, open: 1795.00, change: -14.50, pChange: -0.81, high: 1795.00, low: 1775.00, volume: '4.2M' },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1145.00, open: 1152.00, change: -7.00, pChange: -0.61, high: 1158.00, low: 1140.00, volume: '6.7M' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 6845.00, open: 6802.00, change: 43.00, pChange: 0.63, high: 6890.00, low: 6802.00, volume: '2.1M' },
      { symbol: 'SBICARD', name: 'SBI Cards & Payment Services', price: 661.00, open: 641.00, change: 20.00, pChange: 3.12, high: 667.40, low: 641.00, volume: '2.8M' }
    ]
  },
  {
    sectorName: 'IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 2275.30, open: 2299.90, change: -93.70, pChange: -3.96, high: 2299.90, low: 2272.20, volume: '1.9M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1093.40, open: 1109.90, change: -62.60, pChange: -5.42, high: 1109.90, low: 1093.20, volume: '6.1M' },
      { symbol: 'WIPRO', name: 'Wipro Limited', price: 242.50, open: 246.00, change: -3.50, pChange: -1.42, high: 246.00, low: 241.00, volume: '8.4M' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1319.00, open: 1345.00, change: -26.00, pChange: -1.93, high: 1345.00, low: 1308.00, volume: '3.2M' },
      { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1280.00, open: 1295.00, change: -15.00, pChange: -1.16, high: 1295.00, low: 1275.00, volume: '2.5M' }
    ]
  },
  {
    sectorName: 'Oil & Gas',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1312.70, open: 1324.20, change: 3.70, pChange: 0.28, high: 1324.20, low: 1312.00, volume: '9.7M' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 236.00, open: 237.80, change: -1.80, pChange: -0.76, high: 237.80, low: 235.00, volume: '14.1M' },
      { symbol: 'BPCL', name: 'Bharat Petroleum Corp', price: 320.05, open: 317.20, change: 2.85, pChange: 0.90, high: 321.95, low: 317.20, volume: '9.3M' },
      { symbol: 'IOC', name: 'Indian Oil Corporation', price: 137.80, open: 136.25, change: 1.55, pChange: 1.14, high: 137.80, low: 136.25, volume: '11.2M' },
      { symbol: 'ATGL', name: 'Adani Total Gas Ltd.', price: 614.05, open: 622.00, change: -7.95, pChange: -1.28, high: 622.00, low: 612.95, volume: '4.5M' },
      { symbol: 'GAIL', name: 'GAIL (India) Ltd.', price: 174.67, open: 172.01, change: 2.66, pChange: 1.55, high: 174.67, low: 172.01, volume: '8.7M' }
    ]
  },
  {
    sectorName: 'FMCG',
    stocks: [
      { symbol: 'ITC', name: 'ITC Limited', price: 468.20, open: 472.00, change: -2.80, pChange: -0.59, high: 474.50, low: 466.00, volume: '12.1M' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2350.00, open: 2365.00, change: -15.00, pChange: -0.63, high: 2370.00, low: 2340.00, volume: '2.1M' },
      { symbol: 'BRITANNIA', name: 'Britannia Industries', price: 5130.00, open: 5146.00, change: -16.00, pChange: -0.31, high: 5146.00, low: 5079.00, volume: '620K' },
      { symbol: 'MARICO', name: 'Marico Limited', price: 620.00, open: 625.00, change: -5.00, pChange: -0.80, high: 628.00, low: 618.00, volume: '3.4M' },
      { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 1180.00, open: 1190.00, change: -10.00, pChange: -0.84, high: 1195.00, low: 1175.00, volume: '2.2M' },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1019.20, open: 1008.00, change: 11.20, pChange: 1.11, high: 1023.00, low: 1008.00, volume: '1.9M' }
    ]
  },
  {
    sectorName: 'Automobile',
    stocks: [
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 11450.00, open: 11520.00, change: -50.00, pChange: -0.43, high: 11600.00, low: 11400.00, volume: '850K' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 2850.00, open: 2880.00, change: -30.00, pChange: -1.04, high: 2890.00, low: 2840.00, volume: '3.4M' },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', price: 4680.00, open: 4720.00, change: -40.00, pChange: -0.85, high: 4730.00, low: 4660.00, volume: '750K' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 8850.00, open: 8920.00, change: -70.00, pChange: -0.78, high: 8950.00, low: 8800.00, volume: '620K' },
      { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 4780.00, open: 4810.00, change: -30.00, pChange: -0.62, high: 4820.00, low: 4750.00, volume: '890K' }
    ]
  }
];

export function MarketProvider({ children }) {
  const [activeSymbol, setActiveSymbol] = useState('NIFTY 50');
  const [watchlistSectors, setWatchlistSectors] = useState(INITIAL_SECTOR_WATCHLIST);
  const [marketStatus, setMarketStatus] = useState(getISTMarketStatus());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN'));

  // Continuously refresh quotes for all watchlist stocks
  useEffect(() => {
    let isMounted = true;

    const refreshWatchlistQuotes = async () => {
      setMarketStatus(getISTMarketStatus());
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));

      try {
        const updatedSectors = await Promise.all(
          watchlistSectors.map(async (sector) => {
            const updatedStocks = await Promise.all(
              sector.stocks.map(async (stock) => {
                const quoteRes = await getQuote(stock.symbol);
                if (quoteRes.success && quoteRes.data) {
                  return {
                    ...stock,
                    ...quoteRes.data
                  };
                }
                return stock;
              })
            );
            return {
              ...sector,
              stocks: updatedStocks
            };
          })
        );

        if (isMounted) {
          setWatchlistSectors(updatedSectors);
        }
      } catch (err) {
        console.error('Error refreshing watchlist quotes:', err);
      }
    };

    refreshWatchlistQuotes();
    const timer = setInterval(refreshWatchlistQuotes, 3000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Add stock to sector
  const addStockToWatchlist = async (sectorName, symbolInput) => {
    const symbolUpper = symbolInput.trim().toUpperCase();
    if (!symbolUpper) return false;

    const quoteRes = await getQuote(symbolUpper);
    const stockData = quoteRes.data;

    setWatchlistSectors(prevSectors => {
      let targetSectorExists = false;
      const newSectors = prevSectors.map(sec => {
        if (sec.sectorName.toLowerCase() === sectorName.toLowerCase()) {
          targetSectorExists = true;
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
      }).filter(sec => sec.stocks.length > 0);
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
