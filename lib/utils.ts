import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * Format grosze amount to PLN display string.
 * 450099 → "4 500,99 zł"
 */
export function formatPLN(grosze: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(grosze / 100);
}

/**
 * Format grosze as a short amount (no currency symbol).
 * 450099 → "4 500,99"
 */
export function formatAmount(grosze: number): string {
  return new Intl.NumberFormat('pl-PL', {
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
 * Returns "Dzisiaj", "Wczoraj", or "5 kwietnia" etc.
 */
export function formatDateGroup(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Dzisiaj';
  if (isYesterday(date)) return 'Wczoraj';
  return format(date, 'd MMMM', { locale: pl });
}

/**
 * Format month key for display. '2026-04' → 'Kwiecień 2026'
 */
export function formatMonthDisplay(monthKey: string): string {
  const date = parseISO(`${monthKey}-01`);
  return format(date, 'LLLL yyyy', { locale: pl });
}

/**
 * Get envelope color based on spending ratio.
 * <60% → green, <85% → orange, ≥85% → red
 */
export function getEnvelopeColor(ratio: number): string {
  if (ratio < 0.6) return '#059669'; // success green
  if (ratio < 0.85) return '#F97316'; // warning orange
  return '#DC2626'; // destructive red
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
