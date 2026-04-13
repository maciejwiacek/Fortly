import { useState, useEffect, useCallback } from 'react';
import { useFinanceStore } from '../stores/finance-store';
import { fetchMultipleStockPrices, type StockPrice } from '../lib/stock-api';

export interface Holding {
  ticker: string;
  label: string;
  totalInvested: number; // grosze — total PLN user says they have in this
  currentPrice: StockPrice | null;
}

export interface PortfolioSummary {
  holdings: Holding[];
  totalInvested: number; // grosze — all investments
  prices: Map<string, StockPrice>;
  isLoading: boolean;
  lastUpdated: number | null;
  refresh: () => void;
}

export function usePortfolioValue(): PortfolioSummary {
  const investmentEntries = useFinanceStore((s) => s.investmentEntries);
  const [prices, setPrices] = useState<Map<string, StockPrice>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Get unique tickers
  const entriesWithTicker = investmentEntries.filter((e) => e.ticker);
  const tickers = [...new Set(entriesWithTicker.map((e) => e.ticker!.toUpperCase()))];

  const fetchPrices = useCallback(async () => {
    if (tickers.length === 0) return;
    setIsLoading(true);
    try {
      const result = await fetchMultipleStockPrices(tickers);
      setPrices(result);
      setLastUpdated(Date.now());
    } finally {
      setIsLoading(false);
    }
  }, [tickers.join(',')]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Group entries by ticker and sum amounts
  const holdingsMap = new Map<string, { label: string; invested: number }>();
  for (const entry of entriesWithTicker) {
    const ticker = entry.ticker!.toUpperCase();
    const existing = holdingsMap.get(ticker) ?? { label: entry.label, invested: 0 };
    existing.invested += entry.amount;
    holdingsMap.set(ticker, existing);
  }

  const holdings: Holding[] = [...holdingsMap.entries()].map(([ticker, data]) => ({
    ticker,
    label: data.label,
    totalInvested: data.invested,
    currentPrice: prices.get(ticker) ?? null,
  }));

  const totalInvested = investmentEntries.reduce((sum, e) => sum + e.amount, 0);

  return {
    holdings,
    totalInvested,
    prices,
    isLoading,
    lastUpdated,
    refresh: fetchPrices,
  };
}
