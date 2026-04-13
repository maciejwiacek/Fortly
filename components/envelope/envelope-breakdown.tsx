import { View, Text } from 'react-native';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { CATEGORIES } from '../../lib/constants';
import { formatPLN } from '../../lib/utils';

interface EnvelopeBreakdownProps {
  monthKey: string;
}

export function EnvelopeBreakdown({ monthKey }: EnvelopeBreakdownProps) {
  const transactions = useMonthlyTransactions(monthKey);

  // Only envelope transactions, grouped by category
  const envelopeTransactions = transactions.filter((t) => t.isEnvelope);
  const categoryTotals = new Map<string, number>();

  for (const t of envelopeTransactions) {
    const current = categoryTotals.get(t.category) ?? 0;
    categoryTotals.set(t.category, current + t.amount);
  }

  const sorted = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="font-sans text-sm text-muted-foreground">
          No envelope spending yet this month
        </Text>
      </View>
    );
  }

  const maxAmount = sorted[0][1];

  return (
    <View className="px-4">
      <Text className="font-sans-medium text-sm text-muted-foreground mb-3">
        Breakdown
      </Text>
      {sorted.map(([category, amount]) => {
        const cat = CATEGORIES.find((c) => c.value === category);
        const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

        return (
          <View key={category} className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="font-sans-medium text-sm text-foreground">
                {cat?.label ?? category}
              </Text>
              <Text className="font-sans text-sm text-muted-foreground">
                {formatPLN(amount)}
              </Text>
            </View>
            <View className="h-2 rounded-full bg-background overflow-hidden">
              <View
                className="h-full rounded-full bg-warning"
                style={{ width: `${barWidth}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
