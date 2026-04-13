import { View, Text, Pressable } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Transaction } from '../../lib/types';

const WEEKDAYS = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'Sb', 'Nd'];

interface SpendingCalendarProps {
  month: Date; // any date in the target month
  transactions: Transaction[];
  selectedDate: string | null; // 'YYYY-MM-DD' or null for all
  onSelectDate: (date: string | null) => void;
}

function getDotColor(amount: number): string {
  if (amount === 0) return 'transparent';
  if (amount < 5000) return '#059669'; // <50 PLN — green
  if (amount < 15000) return '#F97316'; // <150 PLN — orange
  return '#DC2626'; // 150+ PLN — red
}

export function SpendingCalendar({
  month,
  transactions,
  selectedDate,
  onSelectDate,
}: SpendingCalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Build daily totals map
  const dailyTotals = new Map<string, number>();
  for (const t of transactions) {
    const current = dailyTotals.get(t.date) ?? 0;
    dailyTotals.set(t.date, current + t.amount);
  }

  // Monday=0 offset for first day (date-fns getDay: 0=Sun, 1=Mon...)
  const firstDayOfWeek = getDay(monthStart);
  // Convert to Monday-based: Mon=0, Tue=1, ..., Sun=6
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Create grid cells: empty slots + actual days
  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...days,
  ];

  return (
    <View className="mx-4 mb-3">
      {/* Weekday headers */}
      <View className="flex-row mb-1">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <Text className="font-sans-medium text-xs text-muted-foreground">
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="flex-row flex-wrap">
        {cells.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={{ width: '14.28%', height: 44 }} />;
          }

          const dateStr = format(day, 'yyyy-MM-dd');
          const total = dailyTotals.get(dateStr) ?? 0;
          const isSelected = selectedDate === dateStr;
          const today = isToday(day);
          const dotColor = getDotColor(total);
          const hasSpending = total > 0;

          return (
            <Pressable
              key={dateStr}
              onPress={() => onSelectDate(isSelected ? null : dateStr)}
              style={{
                width: '14.28%',
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected
                    ? '#1E40AF'
                    : today
                    ? '#192134'
                    : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 14,
                    color: isSelected
                      ? '#FFFFFF'
                      : today
                      ? '#3B82F6'
                      : '#F8FAFC',
                  }}
                >
                  {format(day, 'd')}
                </Text>
              </View>
              {/* Spending dot */}
              {hasSpending && !isSelected && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: dotColor,
                    position: 'absolute',
                    bottom: 2,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
