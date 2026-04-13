import { useMemo } from 'react';
import { useFinanceStore } from '../stores/finance-store';
import { getMonthKey } from '../lib/utils';
import type { Transaction } from '../lib/types';

export function useMonthlyTransactions(monthKey: string): Transaction[] {
  const transactions = useFinanceStore((s) => s.transactions);

  return useMemo(
    () =>
      transactions
        .filter((t) => getMonthKey(t.date) === monthKey)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [transactions, monthKey]
  );
}
