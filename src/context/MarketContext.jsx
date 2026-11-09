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

const PORTFOLIO_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/11yWyePTkedJFZfCarfziaSo0lIHm1yWB3yHhKMLEBbY/gviz/tq?tqx=out:csv&gid=0';
const PORTFOLIO_ENABLED_STORAGE_KEY = 'deltafox_portfolio_enabled';
const DELTAFOX_OPTIONS_ENABLED_STORAGE_KEY = 'deltafox_options_enabled';

// Parse CSV first row into columns
function parseCSVFirstLineCols(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const firstLine = csvText.trim().split('\n')[0];
  if (!firstLine) return [];

  const cols = [];
  let cur = '';
  let inQuotes = false;
  for (let c = 0; c < firstLine.length; c++) {
    const char = firstLine[c];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cols.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  cols.push(cur.trim());
  return cols;
}

// Parse cell R1 (row 0, column 17) to determine if Portfolio is Enabled or Disabled
function parsePortfolioEnabledFromCSV(csvText) {
  const cols = parseCSVFirstLineCols(csvText);
  if (!cols.length) return true;

  // Direct check for cell R1 (column index 17, 0-indexed A=0, ..., R=17)
  let statusVal = cols[17] || '';

  // Fallback check: look for column containing "status" (case-insensitive) and read next column
  if (!statusVal) {
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] && cols[i].toLowerCase() === 'status' && cols[i + 1]) {
        statusVal = cols[i + 1];
        break;
      }
    }
  }

  const cleanVal = statusVal.toLowerCase().trim();
  if (cleanVal === 'disable' || cleanVal === 'disabled') {
    return false;
  }
  return true;
}

// Parse cell U1 (row 0, column 20) to determine if DeltaFox Options is Enabled or Disabled
function parseDeltaFoxOptionsEnabledFromCSV(csvText) {
  const cols = parseCSVFirstLineCols(csvText);
  if (!cols.length) return true;

  // Direct check for cell U1 (column index 20, 0-indexed A=0, ..., U=20)
  let statusVal = cols[20] || '';

  // Fallback check: look for column containing "deltafox options" (case-insensitive) and read next column
  if (!statusVal) {
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] && cols[i].toLowerCase().includes('deltafox options') && cols[i + 1]) {
        statusVal = cols[i + 1];
        break;
      }
    }
  }

  const cleanVal = statusVal.toLowerCase().trim();
  if (cleanVal === 'disable' || cleanVal === 'disabled') {
    return false;
  }
  return true;
}

export function MarketProvider({ children }) {
  const [activeSymbol, setActiveSymbol] = useState('NIFTY 50');
  const [watchlistSectors, setWatchlistSectors] = useState(INITIAL_SECTOR_WATCHLIST);
  const [marketStatus, setMarketStatus] = useState(getISTMarketStatus());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-IN'));
  const [portfolioEnabled, setPortfolioEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_ENABLED_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return true;
  });
  const [deltafoxOptionsEnabled, setDeltafoxOptionsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(DELTAFOX_OPTIONS_ENABLED_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return true;
  });

  // Fetch and poll Google Sheet R1 & U1 cell statuses every 10s & on window focus
  useEffect(() => {
    let isMounted = true;

    const checkSheetStatuses = async () => {
      try {
        const url = `${PORTFOLIO_SHEET_CSV_URL}&_t=${Date.now()}`;
        const res = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (res.ok) {
          const text = await res.text();
          const isPortEnabled = parsePortfolioEnabledFromCSV(text);
          const isOptionsEnabled = parseDeltaFoxOptionsEnabledFromCSV(text);
          if (isMounted) {
            setPortfolioEnabled(isPortEnabled);
            setDeltafoxOptionsEnabled(isOptionsEnabled);
            try {
              localStorage.setItem(PORTFOLIO_ENABLED_STORAGE_KEY, String(isPortEnabled));
              localStorage.setItem(DELTAFOX_OPTIONS_ENABLED_STORAGE_KEY, String(isOptionsEnabled));
            } catch (e) {
              console.warn('LocalStorage write error:', e);
            }
          }
        }
      } catch (err) {
        console.warn('Error checking portfolio / deltafox options status from sheet:', err);
      }
    };

    checkSheetStatuses();
    const interval = setInterval(checkSheetStatuses, 10000);
    const handleFocus = () => checkSheetStatuses();
    window.addEventListener('focus', handleFocus, { passive: true });

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
        lastUpdated,
        portfolioEnabled,
        deltafoxOptionsEnabled
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
