import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { CATEGORIES } from '../../lib/constants';
import { formatPLN, getCurrentMonthKey } from '../../lib/utils';

const ICON_MAP: Record<string, string> = {
  UtensilsCrossed: 'coffee',
  ShoppingCart: 'shopping-cart',
  Car: 'truck',
  Gamepad2: 'play',
  ShoppingBag: 'shopping-bag',
  FileText: 'file-text',
  Heart: 'heart',
  GraduationCap: 'book',
  Repeat: 'repeat',
  Gift: 'gift',
  MoreHorizontal: 'more-horizontal',
};

export function RecentTransactions() {
  const monthKey = getCurrentMonthKey();
  const transactions = useMonthlyTransactions(monthKey);
  const colors = useThemeColors();
  const router = useRouter();

  const recent = transactions.slice(0, 4);

  if (recent.length === 0) return null;

  return (
    <View className="mx-4 mb-3">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="font-sans-semibold text-sm text-foreground">
          Recent Transactions
        </Text>
        <Pressable onPress={() => router.push('/(tabs)/transactions' as any)}>
          <Text className="font-sans-medium text-xs text-primary">See All</Text>
        </Pressable>
      </View>
      <View className="bg-card rounded-2xl overflow-hidden">
        {recent.map((tx, i) => {
          const cat = CATEGORIES.find((c) => c.value === tx.category);
          const iconName = cat ? (ICON_MAP[cat.icon] ?? 'circle') : 'circle';

          return (
            <View
              key={tx.id}
              className="flex-row items-center px-4 py-3"
              style={i < recent.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.backgroundSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Feather name={iconName as any} size={16} color={colors.mutedForeground} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-medium text-sm text-foreground">
                  {cat?.label ?? tx.category}
                </Text>
                {tx.note ? (
                  <Text className="font-sans text-xs text-muted-foreground" numberOfLines={1}>
                    {tx.note}
                  </Text>
                ) : null}
              </View>
              <Text className="font-sans-semibold text-sm text-foreground">
                -{formatPLN(tx.amount)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
