import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PageHeader } from '../../components/layout/page-header';
import { BudgetAllocation } from '../../components/dashboard/budget-allocation';
import { GoalsSummary } from '../../components/dashboard/goals-summary';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';
import { DashboardHoldings } from '../../components/investments/investment-checklist';
import { RecentTransactions } from '../../components/dashboard/recent-transactions';
import { useFinanceStore } from '../../stores/finance-store';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { formatPLN, formatMonthDisplay, getCurrentMonthKey } from '../../lib/utils';

export default function DashboardScreen() {
  const monthKey = getCurrentMonthKey();
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const transactions = useMonthlyTransactions(monthKey);
  const colors = useThemeColors();
  const router = useRouter();

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = Math.max(0, monthlyIncome - totalSpent);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <PageHeader greeting showSettings subtitle={formatMonthDisplay(monthKey)} title="Dashboard" />

        {/* Balance Hero */}
        <View className="px-4 pt-2 pb-5">
          <Text className="font-sans text-sm text-muted-foreground mb-1">Remaining Balance</Text>
          <Text className="font-sans-bold text-foreground" style={{ fontSize: 38 }}>
            {formatPLN(remaining)}
          </Text>
          <View className="flex-row items-center mt-2 gap-4">
            <View className="flex-row items-center">
              <Feather name="arrow-down" size={14} color={colors.destructive} />
              <Text className="font-sans-medium text-sm text-muted-foreground ml-1">
                {formatPLN(totalSpent)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="arrow-up" size={14} color={colors.success} />
              <Text className="font-sans-medium text-sm text-muted-foreground ml-1">
                {formatPLN(monthlyIncome)}
              </Text>
            </View>
          </View>
        </View>

        {/* Budget Allocation */}
        <BudgetAllocation />

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* AI Insight */}
        <AIInsightCard />

        {/* Goals */}
        <GoalsSummary />

        {/* Holdings */}
        <DashboardHoldings />

        <SafeAreaView edges={['bottom']} style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
