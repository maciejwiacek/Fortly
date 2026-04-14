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
      return `${label}: ${formatAmount(amount)} PLN`;
    })
    .join(', ');

  // Goals
  const goalsInfo = goals
    .map((g) => {
      const contributed = goalContributions
        .filter((gc) => gc.goalId === g.id)
        .reduce((sum, gc) => sum + gc.amount, 0);
      const pct = g.targetAmount > 0 ? Math.round((contributed / g.targetAmount) * 100) : 0;
      return `${g.label} (${g.isDebt ? 'debt' : 'goal'}): ${pct}% of ${formatAmount(g.targetAmount)} PLN`;
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

  return `You are the user's personal financial advisor. Here is their current data:
- Monthly income: ${formatAmount(monthlyIncome)} PLN
- Budget strategy: ${strategyLabel} (Needs ${budgetStrategy.needs}% / Wants ${budgetStrategy.wants}% / Savings ${budgetStrategy.savings}%)
- Spending this month: ${formatAmount(totalSpent)} PLN
  - Needs: ${formatAmount(needsSpent)} PLN of ${formatAmount(needsBudget)} PLN
  - Wants: ${formatAmount(wantsSpent)} PLN of ${formatAmount(wantsBudget)} PLN
  - Savings: ${formatAmount(savingsContributed)} PLN of ${formatAmount(savingsBudget)} PLN
- Top categories: ${topCategories || 'no spending yet'}
- Goals: ${goalsInfo || 'no goals set'}
- Investments: total ${formatAmount(totalInvested)} PLN${uniqueTickers.length > 0 ? ` (${uniqueTickers.join(', ')})` : ''}
- Day of month: ${dayOfMonth}/${daysInMonth}

Respond concisely (max 3-4 sentences), be specific, use PLN amounts.
Focus on practical savings and budget optimization advice.`;
}
