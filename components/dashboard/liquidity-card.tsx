import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFinanceStore } from '../../stores/finance-store';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { formatPLN, getCurrentMonthKey } from '../../lib/utils';

export function SpendingSummaryCard() {
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const monthKey = getCurrentMonthKey();
  const transactions = useMonthlyTransactions(monthKey);
  const colors = useThemeColors();

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = Math.max(0, monthlyIncome - totalSpent);

  return (
    <View className="flex-row mx-4 mb-3 gap-3">
      <View className="flex-1 bg-card rounded-2xl p-4">
        <View className="flex-row items-center mb-2">
          <Feather name="arrow-down" size={14} color={colors.destructive} />
          <Text className="font-sans text-xs text-muted-foreground ml-1.5">
            Spent
          </Text>
        </View>
        <Text className="font-sans-semibold text-xl text-destructive">
          {formatPLN(totalSpent)}
        </Text>
      </View>
      <View className="flex-1 bg-card rounded-2xl p-4">
        <View className="flex-row items-center mb-2">
          <Feather name="arrow-up" size={14} color={colors.success} />
          <Text className="font-sans text-xs text-muted-foreground ml-1.5">
            Remaining
          </Text>
        </View>
        <Text className="font-sans-semibold text-xl text-success">
          {formatPLN(remaining)}
        </Text>
      </View>
    </View>
  );
}
