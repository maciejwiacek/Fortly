import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { TransactionCategory } from '../../lib/types';
import { CATEGORIES } from '../../lib/constants';

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
                backgroundColor: isSelected ? '#3B82F6' : '#192134',
                borderWidth: isSelected ? 0 : 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Feather
                name={iconName as any}
                size={24}
                color={isSelected ? '#FFFFFF' : '#94A3B8'}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                marginTop: 4,
                color: isSelected ? '#3B82F6' : '#94A3B8',
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
