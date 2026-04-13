import { useMemo } from 'react';
import { useFinanceStore } from '../stores/finance-store';
import { getMonthKey, getEnvelopeColor, clamp } from '../lib/utils';

export interface EnvelopeStatus {
  spent: number; // grosze
  limit: number; // grosze — computed from strategy "wants" %
  remaining: number;
  ratio: number; // 0..1+
  color: string;
  percentage: number; // 0..100+
}

export function useEnvelopeStatus(monthKey: string): EnvelopeStatus {
  const transactions = useFinanceStore((s) => s.transactions);
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const budgetStrategy = useFinanceStore((s) => s.budgetStrategy);

  return useMemo(() => {
    // "Wants" limit is derived from the budget strategy
    const wantsLimit =
      budgetStrategy.customMode === 'fixed' && budgetStrategy.fixedWants != null
        ? budgetStrategy.fixedWants
        : Math.round((monthlyIncome * budgetStrategy.wants) / 100);

    const spent = transactions
      .filter((t) => t.isEnvelope && getMonthKey(t.date) === monthKey)
      .reduce((sum, t) => sum + t.amount, 0);

    const ratio = wantsLimit > 0 ? spent / wantsLimit : 0;
    const remaining = Math.max(0, wantsLimit - spent);

    return {
      spent,
      limit: wantsLimit,
      remaining,
      ratio,
      color: getEnvelopeColor(ratio),
      percentage: Math.round(clamp(ratio, 0, 1) * 100),
    };
  }, [transactions, monthlyIncome, budgetStrategy, monthKey]);
}

/** Budget allocation breakdown for the current strategy */
export function useBudgetAllocation() {
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const budgetStrategy = useFinanceStore((s) => s.budgetStrategy);

  return useMemo(() => {
    // Fixed PLN mode: use raw amounts directly
    if (budgetStrategy.customMode === 'fixed' && budgetStrategy.fixedNeeds != null) {
      return {
        needs: budgetStrategy.fixedNeeds,
        wants: budgetStrategy.fixedWants ?? 0,
        savings: budgetStrategy.fixedSavings ?? 0,
        strategy: budgetStrategy,
      };
    }
    // Percentage mode (default)
    return {
      needs: Math.round((monthlyIncome * budgetStrategy.needs) / 100),
      wants: Math.round((monthlyIncome * budgetStrategy.wants) / 100),
      savings: Math.round((monthlyIncome * budgetStrategy.savings) / 100),
      strategy: budgetStrategy,
    };
  }, [monthlyIncome, budgetStrategy]);
}
