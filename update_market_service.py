with open("src/services/marketData.js", "r") as f:
    content = f.read()

# Replace getYahooSymbol logic to add global indices & triggers
old_yahoo_symbol = """export function getYahooSymbol(symbol) {
  const s = symbol.toUpperCase().trim();
  if (s === 'NIFTY 50' || s === 'NIFTY' || s === 'NIFTY50') return '^NSEI';
  if (s === 'BANK NIFTY' || s === 'BANKNIFTY' || s === 'NIFTY BANK') return '^NSEBANK';
  if (s === 'SENSEX' || s === 'BSE SENSEX') return '^BSESN';
  if (s === 'NIFTY IT' || s === 'CNXIT') return '^CNXIT';
  if (s === 'NIFTY FIN SERVICE' || s === 'NIFTY FINANCIAL SERVICES') return 'NIFTY_FIN_SERVICE.NS';
  if (s === 'NIFTY MIDCAP 100' || s === 'NIFTY MIDCAP') return 'NIFTY_MIDCAP_100.NS';"""

new_yahoo_symbol = """export function getYahooSymbol(symbol) {
  const s = symbol.toUpperCase().trim();
  if (s === 'NIFTY 50' || s === 'NIFTY' || s === 'NIFTY50') return '^NSEI';
  if (s === 'BANK NIFTY' || s === 'BANKNIFTY' || s === 'NIFTY BANK') return '^NSEBANK';
  if (s === 'SENSEX' || s === 'BSE SENSEX') return '^BSESN';
  if (s === 'NIFTY IT' || s === 'CNXIT') return '^CNXIT';
  if (s === 'NIFTY FIN SERVICE' || s === 'NIFTY FINANCIAL SERVICES') return 'NIFTY_FIN_SERVICE.NS';
  if (s === 'NIFTY MIDCAP 100' || s === 'NIFTY MIDCAP') return 'NIFTY_MIDCAP_100.NS';
  if (s === 'DOW JONES' || s === 'DOW JONES INDUSTRIAL AVERAGE' || s === 'DJI') return '^DJI';
  if (s === 'NASDAQ 100' || s === 'NASDAQ' || s === 'NDX') return '^NDX';
  if (s === 'S&P 100' || s === 'OEX') return '^OEX';
  if (s === 'FTSE' || s === 'FTSE 100') return '^FTSE';
  if (s === 'INDIA VIX' || s === 'VIX') return 'INDIAVIX.NS';
  if (s === 'CRUDE OIL' || s === 'CRUDE OIL (BRENT)' || s === 'BRENT') return 'BZ=F';
  if (s === 'USD-INR' || s === 'USDINR') return 'INR=X';"""

if old_yahoo_symbol in content:
    content = content.replace(old_yahoo_symbol, new_yahoo_symbol)
    print("Updated getYahooSymbol")

with open("src/services/marketData.js", "w") as f:
    f.write(content)
