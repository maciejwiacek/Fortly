import { View, Text, SectionList } from 'react-native';
import { TransactionRow } from './transaction-row';
import { formatDateGroup } from '../../lib/utils';
import type { Transaction } from '../../lib/types';

interface TransactionListProps {
  transactions: Transaction[];
}

interface Section {
  title: string;
  data: Transaction[];
}

function groupByDate(transactions: Transaction[]): Section[] {
  const groups = new Map<string, Transaction[]>();

  for (const t of transactions) {
    const existing = groups.get(t.date) ?? [];
    existing.push(t);
    groups.set(t.date, existing);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, data]) => ({
      title: formatDateGroup(date),
      data,
    }));
}

export function TransactionList({ transactions }: TransactionListProps) {
  const sections = groupByDate(transactions);

  if (sections.length === 0) {
    return (
      <View className="items-center py-16">
        <Text className="font-sans text-sm text-muted-foreground">
          No transactions yet
        </Text>
        <Text className="font-sans text-xs text-muted-foreground mt-1">
          Tap + to add one
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionRow transaction={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View className="bg-background px-4 py-2">
          <Text className="font-sans-semibold text-xs text-muted-foreground uppercase tracking-wider">
            {title}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled
    />
  );
}
