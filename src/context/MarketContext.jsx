import React, { createContext, useContext, useState, useEffect } from 'react';
import { getISTMarketStatus, getQuote } from '../services/marketData';

const MarketContext = createContext();

const INITIAL_SECTOR_WATCHLIST = [
  {
    sectorName: 'Finance',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
      { symbol: 'SBIN', name: 'State Bank of India' },
      { symbol: 'SBICARD', name: 'SBI Cards & Payment Services' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
      { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' }
    ]
  },
  {
    sectorName: 'IT',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services' },
      { symbol: 'INFY', name: 'Infosys Limited' },
      { symbol: 'WIPRO', name: 'Wipro Limited' },
      { symbol: 'HCLTECH', name: 'HCL Technologies' },
      { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
      { symbol: 'LTIM', name: 'LTIMindtree Ltd.' }
    ]
  },
  {
    sectorName: 'Oil & Gas',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp' },
      { symbol: 'BPCL', name: 'Bharat Petroleum Corp' },
      { symbol: 'ATGL', name: 'Adani Total Gas Ltd.' },
      { symbol: 'GAIL', name: 'GAIL (India) Ltd.' }
    ]
  },
  {
    sectorName: 'FMCG',
    stocks: [
      { symbol: 'ITC', name: 'ITC Limited' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
      { symbol: 'BRITANNIA', name: 'Britannia Industries' },
      { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products' },
      { symbol: 'DABUR', name: 'Dabur India Ltd.' },
      { symbol: 'MARICO', name: 'Marico Limited' },
      { symbol: 'GODREJCP', name: 'Godrej Consumer Products' }
    ]
  },
  {
    sectorName: 'Automobile',
    stocks: [
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
      { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
      { symbol: 'TMPV', name: 'Tata Motors Passenger Vehicles' },
      { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' }
    ]
  }
];

export function MarketProvider({ children }) {
  const [activeSymbol, setActiveSymbol] = useState('NIFTY 50');
  const [watchlistSectors, setWatchlistSectors] = useState(INITIAL_SECTOR_WATCHLIST);
  const [marketStatus, setMarketStatus] = useState(getISTMarketStatus());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN'));

  // Continuously refresh quotes for all watchlist stocks every 3s
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

  // List all 42 stock symbols + key indices for Chart selection
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
    'POWERGRID',
    'BAJAJFINSV',
    'TECHM',
    'LTIM',
    'ONGC',
    'BPCL',
    'ATGL',
    'GAIL',
    'BRITANNIA',
    'NESTLEIND',
    'TATACONSUM',
    'DABUR',
    'MARICO',
    'GODREJCP',
    'TMPV',
    'EICHERMOT',
    'HEROMOTOCO'
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
