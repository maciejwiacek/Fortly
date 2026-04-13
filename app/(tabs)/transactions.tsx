import { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { format, addMonths, subMonths } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { AnimatedTabScreen } from '../../components/navigation/AnimatedTabScreen';
import { PageHeader } from '../../components/layout/page-header';
import { TransactionList } from '../../components/transactions/transaction-list';
import { SpendingCalendar } from '../../components/transactions/spending-calendar';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { formatMonthDisplay, formatPLN, formatDateGroup } from '../../lib/utils';

export default function TransactionsScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const monthKey = format(currentDate, 'yyyy-MM');
  const allTransactions = useMonthlyTransactions(monthKey);
  const colors = useThemeColors();

  const transactions = useMemo(() => {
    if (!selectedDate) return allTransactions;
    return allTransactions.filter((t) => t.date === selectedDate);
  }, [allTransactions, selectedDate]);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleDateSelect = (date: string | null) => {
    Haptics.selectionAsync();
    setSelectedDate(date);
  };

  return (
    <AnimatedTabScreen>
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="font-sans-bold text-2xl text-foreground">Transactions</Text>
        <Pressable
          onPress={() => { setShowCalendar((v) => !v); Haptics.selectionAsync(); }}
          className="p-2 bg-card rounded-xl"
        >
          <Feather
            name={showCalendar ? 'list' : 'calendar'}
            size={18}
            color={colors.foreground}
          />
        </Pressable>
      </View>

      {/* Month Selector */}
      <View className="flex-row items-center justify-center px-4 mb-3 gap-3">
        <Pressable
          onPress={() => { setCurrentDate((d) => subMonths(d, 1)); setSelectedDate(null); }}
          className="p-2"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={20} color={colors.mutedForeground} />
        </Pressable>
        <View className="bg-card rounded-xl px-4 py-2">
          <Text className="font-sans-medium text-sm text-foreground capitalize">
            {formatMonthDisplay(monthKey)}
          </Text>
        </View>
        <Pressable
          onPress={() => { setCurrentDate((d) => addMonths(d, 1)); setSelectedDate(null); }}
          className="p-2"
          hitSlop={8}
        >
          <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Calendar */}
      {showCalendar && (
        <SpendingCalendar
          month={currentDate}
          transactions={allTransactions}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      )}

      {/* Summary bar */}
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {selectedDate ? (
            <Pressable
              onPress={() => setSelectedDate(null)}
              className="bg-primary/10 rounded-full px-3 py-1 flex-row items-center"
            >
              <Text className="font-sans-medium text-xs text-primary">
                {formatDateGroup(selectedDate)}
              </Text>
              <Feather name="x" size={12} color={colors.primary} style={{ marginLeft: 4 }} />
            </Pressable>
          ) : (
            <Text className="font-sans text-xs text-muted-foreground">
              {allTransactions.length} transactions
            </Text>
          )}
        </View>
        {transactions.length > 0 && (
          <Text className="font-sans-semibold text-xs text-foreground">
            {formatPLN(totalSpent)}
          </Text>
        )}
      </View>

      {/* Transaction list */}
      <View className="flex-1">
        <TransactionList transactions={transactions} />
      </View>
    </SafeAreaView>
    </AnimatedTabScreen>
  );
}
