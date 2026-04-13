import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '../../components/layout/page-header';
import { SpendingSummaryCard } from '../../components/dashboard/liquidity-card';
import { BudgetAllocation } from '../../components/dashboard/budget-allocation';
import { GoalsSummary } from '../../components/dashboard/goals-summary';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';
import { DashboardHoldings } from '../../components/investments/investment-checklist';
import { formatMonthDisplay, getCurrentMonthKey } from '../../lib/utils';

export default function DashboardScreen() {
  const monthKey = getCurrentMonthKey();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <PageHeader greeting showSettings subtitle={formatMonthDisplay(monthKey)} title="Dashboard" />
        <SpendingSummaryCard />
        <AIInsightCard />
        <BudgetAllocation />
        <DashboardHoldings />
        <GoalsSummary />
        <SafeAreaView edges={['bottom']} style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
