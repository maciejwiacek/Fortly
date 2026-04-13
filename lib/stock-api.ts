export interface StockPrice {
  ticker: string;
  price: number; // in native currency (USD, EUR, etc.)
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  name: string;
  fetchedAt: number; // timestamp
}

// In-memory cache: ticker → StockPrice
const priceCache = new Map<string, StockPrice>();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch current stock/ETF/crypto price from Yahoo Finance.
 * Results are cached for 15 minutes.
 */
export async function fetchStockPrice(
  ticker: string
): Promise<StockPrice | null> {
  const upperTicker = ticker.toUpperCase();

  // Check cache
  const cached = priceCache.get(upperTicker);
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION_MS) {
    return cached;
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      upperTicker
    )}?range=1d&interval=1d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) return cached ?? null;

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) return cached ?? null;

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    const stockPrice: StockPrice = {
      ticker: upperTicker,
      price,
      previousClose,
      change,
      changePercent,
      currency: meta.currency ?? 'USD',
      name: meta.shortName ?? meta.symbol ?? upperTicker,
      fetchedAt: Date.now(),
    };

    priceCache.set(upperTicker, stockPrice);
    return stockPrice;
  } catch {
    // Return cached value if available, null otherwise
    return cached ?? null;
  }
}

/**
 * Fetch prices for multiple tickers in parallel.
 */
export async function fetchMultipleStockPrices(
  tickers: string[]
): Promise<Map<string, StockPrice>> {
  const results = new Map<string, StockPrice>();
  const uniqueTickers = [...new Set(tickers.map((t) => t.toUpperCase()))];

  const promises = uniqueTickers.map(async (ticker) => {
    const price = await fetchStockPrice(ticker);
    if (price) results.set(ticker, price);
  });

  await Promise.all(promises);
  return results;
}

/**
 * Clear the price cache (useful for force refresh).
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
