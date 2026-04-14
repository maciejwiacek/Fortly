import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { buildFinancialContext } from '../lib/ai-context';
import { generateInsight } from '../lib/gemini-api';
import { useFinanceStore } from '../stores/finance-store';

const FALLBACK_TIPS = [
  'Review your subscriptions — you might be paying for unused services.',
  'Try the 24-hour rule — wait a day before making big purchases.',
  'Set up an automatic transfer to savings on payday.',
  'Cook at home instead of ordering — you could save up to 500 PLN monthly.',
  'Compare prices before buying online — differences can be huge.',
  'Track every expense — awareness is the first step to saving.',
  'Consider cheaper alternatives for your regular expenses.',
  'Plan meals for the week — less food waste, more savings.',
];

function getCacheKey(): string {
  return `ai-insight-${new Date().toISOString().slice(0, 10)}`;
}

function getRandomFallback(): string {
  return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
}

export function useAIInsights(): {
  insight: string | null;
  isLoading: boolean;
  refresh: () => void;
} {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const budgetStrategy = useFinanceStore((s) => s.budgetStrategy);
  const transactions = useFinanceStore((s) => s.transactions);
  const goals = useFinanceStore((s) => s.goals);
  const goalContributions = useFinanceStore((s) => s.goalContributions);
  const investmentEntries = useFinanceStore((s) => s.investmentEntries);

  const fetchInsight = useCallback(
    async (skipCache = false) => {
      setIsLoading(true);

      try {
        const cacheKey = getCacheKey();

        if (!skipCache) {
          const cached = await AsyncStorage.getItem(cacheKey);
          if (cached) {
            if (isMounted.current) {
              setInsight(cached);
              setIsLoading(false);
            }
            return;
          }
        }

        const context = buildFinancialContext({
          monthlyIncome,
          budgetStrategy,
          transactions,
          goals,
          goalContributions,
          investmentEntries,
        });

        const result = await generateInsight(context);

        if (isMounted.current) {
          if (result) {
            setInsight(result);
            await AsyncStorage.setItem(cacheKey, result);
          } else {
            setInsight(getRandomFallback());
          }
        }
      } catch {
        if (isMounted.current) {
          setInsight(getRandomFallback());
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [monthlyIncome, budgetStrategy, transactions, goals, goalContributions, investmentEntries]
  );

  useEffect(() => {
    isMounted.current = true;
    fetchInsight();
    return () => { isMounted.current = false; };
  }, [fetchInsight]);

  const refresh = useCallback(() => {
    fetchInsight(true);
  }, [fetchInsight]);

  return { insight, isLoading, refresh };
}
