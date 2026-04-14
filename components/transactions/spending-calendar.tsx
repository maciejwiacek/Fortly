import { View, Text, Pressable } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
} from 'date-fns';
import type { Transaction } from '../../lib/types';
import { useThemeColors } from '../../hooks/use-theme-colors';

const WEEKDAYS = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'Sb', 'Nd'];

interface SpendingCalendarProps {
  month: Date;
  transactions: Transaction[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function SpendingCalendar({
  month,
  transactions,
  selectedDate,
  onSelectDate,
}: SpendingCalendarProps) {
  const colors = useThemeColors();
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dailyTotals = new Map<string, number>();
  for (const t of transactions) {
    const current = dailyTotals.get(t.date) ?? 0;
    dailyTotals.set(t.date, current + t.amount);
  }

  const firstDayOfWeek = getDay(monthStart);
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...days,
  ];

  function getDotColor(amount: number): string {
    if (amount === 0) return 'transparent';
    if (amount < 5000) return colors.success;
    if (amount < 15000) return colors.warning;
    return colors.destructive;
  }

  return (
    <View className="mx-4 mb-3">
      <View className="flex-row mb-1">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <Text className="font-sans-medium text-xs text-muted-foreground">
              {d}
            </Text>
          </View>
        ))}
      </View>

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
                    ? colors.primary
                    : today
                    ? colors.card
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
                      ? colors.primaryLight
                      : colors.foreground,
                  }}
                >
                  {format(day, 'd')}
                </Text>
              </View>
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
