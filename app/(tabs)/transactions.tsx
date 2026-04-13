import { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { format, addMonths, subMonths } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { PageHeader } from '../../components/layout/page-header';
import { TransactionList } from '../../components/transactions/transaction-list';
import { SpendingCalendar } from '../../components/transactions/spending-calendar';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { formatMonthDisplay, formatPLN, formatDateGroup } from '../../lib/utils';

export default function TransactionsScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const monthKey = format(currentDate, 'yyyy-MM');
  const allTransactions = useMonthlyTransactions(monthKey);

  // Filter by selected day if any
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center justify-between pr-4">
        <PageHeader title="Transactions" />
        <Pressable
          onPress={() => {
            setShowCalendar((v) => !v);
            Haptics.selectionAsync();
          }}
          className="p-2 bg-card rounded-lg"
        >
          {showCalendar ? (
            <Feather name="list" size={18} color="#94A3B8" />
          ) : (
            <Feather name="calendar" size={18} color="#94A3B8" />
          )}
        </Pressable>
      </View>

      {/* Month selector */}
      <View className="flex-row items-center justify-between px-4 mb-2">
        <Pressable
          onPress={() => {
            setCurrentDate((d) => subMonths(d, 1));
            setSelectedDate(null);
          }}
          className="p-2"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={20} color="#94A3B8" />
        </Pressable>
        <Text className="font-sans-medium text-sm text-foreground capitalize">
          {formatMonthDisplay(monthKey)}
        </Text>
        <Pressable
          onPress={() => {
            setCurrentDate((d) => addMonths(d, 1));
            setSelectedDate(null);
          }}
          className="p-2"
          hitSlop={8}
        >
          <Feather name="chevron-right" size={20} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Calendar view */}
      {showCalendar && (
        <SpendingCalendar
          month={currentDate}
          transactions={allTransactions}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      )}

      {/* Summary */}
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <Text className="font-sans text-xs text-muted-foreground">
          {selectedDate
            ? formatDateGroup(selectedDate)
            : `${allTransactions.length} transactions`}
        </Text>
        {transactions.length > 0 && (
          <Text className="font-sans text-xs text-muted-foreground">
            Total: <Text className="font-sans-semibold text-warning">{formatPLN(totalSpent)}</Text>
          </Text>
        )}
      </View>

      {/* Selected date chip — tap to clear */}
      {selectedDate && (
        <Pressable
          onPress={() => setSelectedDate(null)}
          className="mx-4 mb-2 self-start bg-primary/20 rounded-full px-3 py-1.5 flex-row items-center"
        >
          <Text className="font-sans-medium text-xs text-secondary">
            {formatDateGroup(selectedDate)}
          </Text>
          <Text className="font-sans text-xs text-muted-foreground ml-2">✕</Text>
        </Pressable>
      )}

      {/* Transaction list */}
      <View className="flex-1">
        <TransactionList transactions={transactions} />
      </View>
    </SafeAreaView>
  );
}
