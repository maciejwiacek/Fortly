import { CATEGORIES } from './constants';
import {
  NEEDS_CATEGORIES,
  WANTS_CATEGORIES,
  type BudgetStrategy,
  type Goal,
  type GoalContribution,
  type InvestmentEntry,
  type Transaction,
} from './types';
import { formatAmount, getCurrentMonthKey, getMonthKey } from './utils';

interface FinanceSnapshot {
  monthlyIncome: number;
  budgetStrategy: BudgetStrategy;
  transactions: Transaction[];
  goals: Goal[];
  goalContributions: GoalContribution[];
  investmentEntries: InvestmentEntry[];
}

function getBudgetAmount(
  income: number,
  strategy: BudgetStrategy,
  bucket: 'needs' | 'wants' | 'savings'
): number {
  if (strategy.type === 'custom' && strategy.customMode === 'fixed') {
    if (bucket === 'needs') return strategy.fixedNeeds ?? 0;
    if (bucket === 'wants') return strategy.fixedWants ?? 0;
    return strategy.fixedSavings ?? 0;
  }
  return Math.round((income * strategy[bucket]) / 100);
}

/**
 * Build a Polish-language financial context string for the AI system prompt.
 */
export function buildFinancialContext(snapshot: FinanceSnapshot): string {
  const {
    monthlyIncome,
    budgetStrategy,
    transactions,
    goals,
    goalContributions,
    investmentEntries,
  } = snapshot;

  const monthKey = getCurrentMonthKey();
  const monthTx = transactions.filter((t) => getMonthKey(t.date) === monthKey);

  // Spending by bucket
  const needsSpent = monthTx
    .filter((t) => NEEDS_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const wantsSpent = monthTx
    .filter((t) => WANTS_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = monthTx.reduce((sum, t) => sum + t.amount, 0);

  const needsBudget = getBudgetAmount(monthlyIncome, budgetStrategy, 'needs');
  const wantsBudget = getBudgetAmount(monthlyIncome, budgetStrategy, 'wants');
  const savingsBudget = getBudgetAmount(monthlyIncome, budgetStrategy, 'savings');

  // Top categories
  const categoryTotals = new Map<string, number>();
  for (const tx of monthTx) {
    categoryTotals.set(
      tx.category,
      (categoryTotals.get(tx.category) ?? 0) + tx.amount
    );
  }
  const topCategories = [...categoryTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amount]) => {
      const label = CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
      return `${label}: ${formatAmount(amount)} zł`;
    })
    .join(', ');

  // Goals
  const goalsInfo = goals
    .map((g) => {
      const contributed = goalContributions
        .filter((gc) => gc.goalId === g.id)
        .reduce((sum, gc) => sum + gc.amount, 0);
      const pct = g.targetAmount > 0 ? Math.round((contributed / g.targetAmount) * 100) : 0;
      return `${g.label} (${g.isDebt ? 'dług' : 'cel'}): ${pct}% z ${formatAmount(g.targetAmount)} zł`;
    })
    .join('; ');

  // Investments
  const monthInvestments = investmentEntries.filter(
    (e) => getMonthKey(e.date) === monthKey
  );
  const totalInvested = investmentEntries.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const uniqueTickers = [
    ...new Set(investmentEntries.filter((e) => e.ticker).map((e) => e.ticker)),
  ];

  // Day of month
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Savings this month (goal contributions + investments)
  const monthContributions = goalContributions
    .filter((gc) => getMonthKey(gc.date) === monthKey)
    .reduce((sum, gc) => sum + gc.amount, 0);
  const monthInvestedAmount = monthInvestments.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const savingsContributed = monthContributions + monthInvestedAmount;

  const strategyLabel =
    budgetStrategy.type === 'custom'
      ? `Custom (${budgetStrategy.needs}/${budgetStrategy.wants}/${budgetStrategy.savings})`
      : budgetStrategy.type;

  return `Jesteś osobistym doradcą finansowym użytkownika. Oto jego aktualne dane:
- Dochód miesięczny: ${formatAmount(monthlyIncome)} zł
- Strategia budżetowa: ${strategyLabel} (Potrzeby ${budgetStrategy.needs}% / Przyjemności ${budgetStrategy.wants}% / Oszczędności ${budgetStrategy.savings}%)
- Wydatki w tym miesiącu: ${formatAmount(totalSpent)} zł
  - Potrzeby: ${formatAmount(needsSpent)} zł z ${formatAmount(needsBudget)} zł
  - Przyjemności: ${formatAmount(wantsSpent)} zł z ${formatAmount(wantsBudget)} zł
  - Oszczędności: ${formatAmount(savingsContributed)} zł z ${formatAmount(savingsBudget)} zł
- Top kategorie: ${topCategories || 'brak wydatków'}
- Cele: ${goalsInfo || 'brak celów'}
- Inwestycje: łącznie ${formatAmount(totalInvested)} zł${uniqueTickers.length > 0 ? ` (${uniqueTickers.join(', ')})` : ''}
- Dzień miesiąca: ${dayOfMonth}/${daysInMonth}

Odpowiadaj krótko (max 3-4 zdania), konkretnie, po polsku. Podawaj kwoty w złotych.
Skup się na praktycznych poradach oszczędzania i optymalizacji budżetu.`;
}
