import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { TransactionCategory } from '../../lib/types';
import { CATEGORIES } from '../../lib/constants';
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

interface CategoryPickerProps {
  selected: TransactionCategory | null;
  onSelect: (category: TransactionCategory) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-row flex-wrap justify-between px-2">
      {CATEGORIES.map((cat) => {
        const iconName = ICON_MAP[cat.icon] ?? 'circle';
        const isSelected = selected === cat.value;

        return (
          <Pressable
            key={cat.value}
            onPress={() => onSelect(cat.value)}
            className="items-center mb-3"
            style={{ width: '30%' }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? colors.primaryLight : colors.card,
                borderWidth: isSelected ? 0 : 1,
                borderColor: colors.border,
              }}
            >
              <Feather
                name={iconName as any}
                size={24}
                color={isSelected ? '#FFFFFF' : colors.mutedForeground}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                marginTop: 4,
                color: isSelected ? colors.primaryLight : colors.mutedForeground,
              }}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
