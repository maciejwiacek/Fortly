export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'education'
  | 'subscriptions'
  | 'groceries'
  | 'gifts'
  | 'other';

export interface Transaction {
  id: string;
  amount: number; // grosze (integer) — 4599 = 45.99 PLN
  category: TransactionCategory;
  note?: string;
  date: string; // 'YYYY-MM-DD'
  isEnvelope: boolean; // counts toward "Wants" spending limit
  createdAt: string; // ISO datetime
}

// Goals are now dynamic — user-created, stored in the store
export interface Goal {
  id: string;
  label: string;
  icon: string; // Feather icon name (e.g. 'monitor', 'home', 'target')
  color: string; // hex
  targetAmount: number; // grosze
  isDebt: boolean;
  createdAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string; // references Goal.id
  amount: number; // grosze
  date: string; // 'YYYY-MM-DD'
}

// Investments — user enters how much PLN they currently have in a given asset.
// The app fetches the live price and tracks value changes over time.
export interface InvestmentEntry {
  id: string;
  label: string; // "S&P 500", "Bitcoin", custom
  amount: number; // grosze — how much PLN the user has in this asset
  date: string; // 'YYYY-MM-DD' — when they recorded this
  note?: string;
  ticker?: string; // "VOO", "BTC-USD", "CSPX.L" — for live price tracking
}

// Budget strategies
export type BudgetStrategyType = '50-30-20' | '60-20-20' | '70-20-10' | 'custom';

export type CustomMode = 'percentage' | 'fixed'; // percentage or raw PLN

export interface BudgetStrategy {
  type: BudgetStrategyType;
  needs: number; // percentage 0-100
  wants: number;
  savings: number;
  customMode?: CustomMode; // only used when type === 'custom'
  fixedNeeds?: number; // grosze — raw PLN amounts (only when customMode === 'fixed')
  fixedWants?: number;
  fixedSavings?: number;
}

export const BUDGET_STRATEGIES: Record<BudgetStrategyType, BudgetStrategy> = {
  '50-30-20': { type: '50-30-20', needs: 50, wants: 30, savings: 20 },
  '60-20-20': { type: '60-20-20', needs: 60, wants: 20, savings: 20 },
  '70-20-10': { type: '70-20-10', needs: 70, wants: 20, savings: 10 },
  custom: { type: 'custom', needs: 50, wants: 30, savings: 20 },
};

// Which categories count as "needs" vs "wants"
export const NEEDS_CATEGORIES: TransactionCategory[] = [
  'bills',
  'transport',
  'health',
  'groceries',
  'education',
];

export const WANTS_CATEGORIES: TransactionCategory[] = [
  'food',
  'entertainment',
  'shopping',
  'subscriptions',
  'gifts',
  'other',
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO datetime
}

export interface FinanceStore {
  // Onboarding
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;

  // Config
  monthlyIncome: number; // grosze
  budgetStrategy: BudgetStrategy;

  // Data
  transactions: Transaction[];
  goals: Goal[];
  goalContributions: GoalContribution[];
  investmentEntries: InvestmentEntry[];
  chatMessages: ChatMessage[];

  // Transaction actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;

  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Pick<Goal, 'label' | 'icon' | 'color' | 'targetAmount' | 'isDebt'>>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (gc: Omit<GoalContribution, 'id'>) => void;
  deleteGoalContribution: (id: string) => void;

  // Investment actions
  addInvestment: (entry: Omit<InvestmentEntry, 'id'>) => void;
  deleteInvestment: (id: string) => void;

  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Settings
  setBudgetStrategy: (strategy: BudgetStrategy) => void;
  setMonthlyIncome: (amount: number) => void;
}
