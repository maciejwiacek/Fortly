import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { buildFinancialContext } from '../lib/ai-context';
import { generateInsight } from '../lib/gemini-api';
import { useFinanceStore } from '../stores/finance-store';

const FALLBACK_TIPS = [
  'Przejrzyj subskrypcje — często płacisz za usługi, z których nie korzystasz.',
  'Spróbuj zasady 24 godzin — przed większym zakupem poczekaj dzień.',
  'Ustaw automatyczny przelew na oszczędności w dniu wypłaty.',
  'Gotuj w domu zamiast zamawiać — możesz zaoszczędzić nawet 500 zł miesięcznie.',
  'Porównuj ceny przed zakupami online — różnice bywają ogromne.',
  'Zapisuj każdy wydatek — świadomość wydatków to pierwszy krok do oszczędzania.',
  'Rozważ tańsze alternatywy dla swoich stałych wydatków.',
  'Planuj posiłki na tydzień — mniej marnujesz jedzenia i pieniędzy.',
];

function getCacheKey(): string {
  return `ai-insight-${new Date().toISOString().slice(0, 10)}`;
}

function getRandomFallback(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return FALLBACK_TIPS[dayOfYear % FALLBACK_TIPS.length];
}

export function useAIInsights(): {
  insight: string | null;
  isLoading: boolean;
  refresh: () => void;
} {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const store = useFinanceStore();

  const fetchInsight = useCallback(
    async (skipCache = false) => {
      setIsLoading(true);

      try {
        const cacheKey = getCacheKey();

        if (!skipCache) {
          const cached = await AsyncStorage.getItem(cacheKey);
          if (cached) {
            setInsight(cached);
            setIsLoading(false);
            return;
          }
        }

        const context = buildFinancialContext({
          monthlyIncome: store.monthlyIncome,
          budgetStrategy: store.budgetStrategy,
          transactions: store.transactions,
          goals: store.goals,
          goalContributions: store.goalContributions,
          investmentEntries: store.investmentEntries,
        });

        const result = await generateInsight(context);

        if (result) {
          setInsight(result);
          await AsyncStorage.setItem(cacheKey, result);
        } else {
          setInsight(getRandomFallback());
        }
      } catch {
        setInsight(getRandomFallback());
      } finally {
        setIsLoading(false);
      }
    },
    [store.monthlyIncome, store.budgetStrategy, store.transactions, store.goals, store.goalContributions, store.investmentEntries]
  );

  useEffect(() => {
    fetchInsight();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    fetchInsight(true);
  }, [fetchInsight]);

  return { insight, isLoading, refresh };
}
