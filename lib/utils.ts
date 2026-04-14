import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Format grosze amount to PLN display string.
 * 450099 → "4,500.99 PLN"
 */
export function formatPLN(grosze: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PLN',
    currencyDisplay: 'code',
  }).format(grosze / 100).replace('PLN', '').trim() + ' zl';
}

/**
 * Format grosze as a short amount (no currency symbol).
 * 450099 → "4,500.99"
 */
export function formatAmount(grosze: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(grosze / 100);
}

/**
 * Get 'YYYY-MM' key for a date string.
 */
export function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/**
 * Get today's date as 'YYYY-MM-DD'.
 */
export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get current month key as 'YYYY-MM'.
 */
export function getCurrentMonthKey(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Format a date string for display in transaction list.
 * Returns "Today", "Yesterday", or "April 5" etc.
 */
export function formatDateGroup(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d', { locale: enUS });
}

/**
 * Format month key for display. '2026-04' → 'April 2026'
 */
export function formatMonthDisplay(monthKey: string): string {
  const date = parseISO(`${monthKey}-01`);
  return format(date, 'LLLL yyyy', { locale: enUS });
}

/**
 * Get envelope color based on spending ratio.
 * <60% → green, <85% → orange, ≥85% → red
 */
export function getEnvelopeColor(ratio: number): string {
  if (ratio < 0.6) return '#059669';
  if (ratio < 0.85) return '#F97316';
  return '#DC2626';
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
