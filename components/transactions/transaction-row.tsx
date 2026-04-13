import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Transaction } from '../../lib/types';
import { CATEGORIES } from '../../lib/constants';
import { formatPLN } from '../../lib/utils';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';

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

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const colors = useThemeColors();
  const cat = CATEGORIES.find((c) => c.value === transaction.category);
  const iconName = cat ? (ICON_MAP[cat.icon] ?? 'circle') : 'circle';

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteTransaction(transaction.id);
  };

  return (
    <View className="flex-row items-center py-3 px-4">
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: colors.card,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Feather name={iconName as any} size={20} color={colors.mutedForeground} />
      </View>
      <View className="flex-1">
        <Text className="font-sans-medium text-sm text-foreground">
          {cat?.label ?? transaction.category}
        </Text>
        {transaction.note ? (
          <Text className="font-sans text-xs text-muted-foreground" numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}
      </View>
      <Text
        className={`font-sans-semibold text-sm ${
          transaction.isEnvelope ? 'text-warning' : 'text-foreground'
        }`}
      >
        -{formatPLN(transaction.amount)}
      </Text>
      <Pressable onPress={handleDelete} className="ml-3 p-2" hitSlop={8}>
        <Feather name="trash-2" size={16} color={colors.destructive} />
      </Pressable>
    </View>
  );
}
