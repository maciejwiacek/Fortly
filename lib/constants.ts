import type { TransactionCategory } from './types';

export interface CategoryConfig {
  value: TransactionCategory;
  label: string;
  icon: string; // Lucide icon name
  isEnvelopeDefault: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  { value: 'food', label: 'Food', icon: 'UtensilsCrossed', isEnvelopeDefault: true },
  { value: 'groceries', label: 'Groceries', icon: 'ShoppingCart', isEnvelopeDefault: false },
  { value: 'transport', label: 'Transport', icon: 'Car', isEnvelopeDefault: false },
  { value: 'entertainment', label: 'Fun', icon: 'Gamepad2', isEnvelopeDefault: true },
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag', isEnvelopeDefault: true },
  { value: 'bills', label: 'Bills', icon: 'FileText', isEnvelopeDefault: false },
  { value: 'health', label: 'Health', icon: 'Heart', isEnvelopeDefault: false },
  { value: 'education', label: 'Education', icon: 'GraduationCap', isEnvelopeDefault: false },
  { value: 'subscriptions', label: 'Subs', icon: 'Repeat', isEnvelopeDefault: true },
  { value: 'gifts', label: 'Gifts', icon: 'Gift', isEnvelopeDefault: true },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal', isEnvelopeDefault: false },
];

export const GOAL_COLORS = [
  '#F43F5E', // rose
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#F97316', // orange
  '#10B981', // emerald
  '#EC4899', // pink
  '#6366F1', // indigo
  '#EAB308', // yellow
  '#14B8A6', // teal
  '#F472B6', // pink light
];

// Investment type presets (label only, no ticker)
export const INVESTMENT_PRESETS = [
  'S&P 500',
  'ETF',
  'Crypto',
  'Bonds',
  'Real Estate Fund',
  'Savings Account',
  'Other',
];

// Ticker presets with labels for quick selection
export interface TickerPreset {
  ticker: string;
  label: string;
  category: 'etf' | 'crypto' | 'stock';
}

export const TICKER_PRESETS: TickerPreset[] = [
  { ticker: 'VOO', label: 'S&P 500 (Vanguard)', category: 'etf' },
  { ticker: 'SPY', label: 'S&P 500 (SPDR)', category: 'etf' },
  { ticker: 'CSPX.L', label: 'S&P 500 (iShares EU)', category: 'etf' },
  { ticker: 'QQQ', label: 'Nasdaq 100', category: 'etf' },
  { ticker: 'VWCE.DE', label: 'FTSE All-World', category: 'etf' },
  { ticker: 'BTC-USD', label: 'Bitcoin', category: 'crypto' },
  { ticker: 'ETH-USD', label: 'Ethereum', category: 'crypto' },
  { ticker: 'SOL-USD', label: 'Solana', category: 'crypto' },
  { ticker: 'AAPL', label: 'Apple', category: 'stock' },
  { ticker: 'MSFT', label: 'Microsoft', category: 'stock' },
  { ticker: 'NVDA', label: 'Nvidia', category: 'stock' },
  { ticker: 'TSLA', label: 'Tesla', category: 'stock' },
];

// Runtime color constants for inline styles, SVG, animations (can't use CSS vars)
export const COLORS_LIGHT = {
  background: '#F8F9FB',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  secondary: '#3B82F6',
  success: '#059669',
  warning: '#F97316',
  destructive: '#DC2626',
  foreground: '#0F172A',
  foregroundSecondary: '#334155',
  muted: '#94A3B8',
  mutedForeground: '#64748B',
  border: '#E2E8F0',
  trackBackground: '#E2E8F0',
} as const;

export const COLORS_DARK = {
  background: '#0F172A',
  backgroundSecondary: '#1A2332',
  card: '#192134',
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  secondary: '#3B82F6',
  success: '#059669',
  warning: '#F97316',
  destructive: '#DC2626',
  foreground: '#F8FAFC',
  foregroundSecondary: '#CBD5E1',
  muted: '#64748B',
  mutedForeground: '#94A3B8',
  border: 'rgba(255,255,255,0.08)',
  trackBackground: 'rgba(255,255,255,0.08)',
} as const;

// Legacy — use useThemeColors() hook instead
export const COLORS = COLORS_DARK;
