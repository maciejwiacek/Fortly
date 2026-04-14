import { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { GOAL_COLORS } from '../../lib/constants';
import { GOAL_ICONS } from '../../lib/goal-icons';

interface CreateGoalSheetProps {
  onClose: () => void;
}

export function CreateGoalSheet({ onClose }: CreateGoalSheetProps) {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const colors = useThemeColors();
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState<string>('target');
  const [color, setColor] = useState('#8B5CF6');
  const [targetText, setTargetText] = useState('');
  const [isDebt, setIsDebt] = useState(false);

  const handleSubmit = () => {
    const target = parseFloat(targetText.replace(',', '.'));
    if (!label.trim() || isNaN(target) || target <= 0) return;

    addGoal({
      label: label.trim(),
      icon,
      color,
      targetAmount: Math.round(target * 100),
      isDebt,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const isValid = label.trim().length > 0 && (() => {
    const num = parseFloat(targetText.replace(',', '.'));
    return !isNaN(num) && num > 0;
  })();

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-card rounded-t-3xl px-4 pb-10 pt-4" style={{ maxHeight: '85%' }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-sans-semibold text-lg text-foreground">
              New Goal
            </Text>
            <Pressable onPress={onClose} className="p-2" hitSlop={8}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Name
            </Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. New Car, Vacation, Emergency Fund"
              placeholderTextColor={colors.muted}
              autoFocus
              selectionColor="#3B82F6"
              style={{ backgroundColor: '#0F172A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_500Medium', fontSize: 16, color: '#F8FAFC', marginBottom: 16 }}
            />

            {/* Target Amount */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Target Amount (PLN)
            </Text>
            <View className="bg-background rounded-xl px-4 flex-row items-center mb-4" style={{ minHeight: 52 }}>
              <TextInput
                value={targetText}
                onChangeText={setTargetText}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                selectionColor="#3B82F6"
                style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 18, color: '#F8FAFC', paddingVertical: 14 }}
              />
              <Text className="font-sans text-lg text-muted-foreground ml-2">zl</Text>
            </View>

            {/* Is Debt toggle */}
            <View className="bg-background rounded-xl px-4 py-3 flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-sans-medium text-sm text-foreground">
                  This is a debt
                </Text>
                <Text className="font-sans text-xs text-muted-foreground">
                  Shows remaining amount instead of saved
                </Text>
              </View>
              <Switch
                value={isDebt}
                onValueChange={setIsDebt}
                trackColor={{ false: '#1E293B', true: '#F43F5E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Icon Picker */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Icon
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {GOAL_ICONS.map((iconName) => (
                <Pressable
                  key={iconName}
                  onPress={() => setIcon(iconName)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: icon === iconName ? color + '30' : colors.background,
                    borderWidth: icon === iconName ? 1.5 : 0,
                    borderColor: icon === iconName ? color : 'transparent',
                  }}
                >
                  <Feather
                    name={iconName as any}
                    size={20}
                    color={icon === iconName ? color : '#94A3B8'}
                  />
                </Pressable>
              ))}
            </View>

            {/* Color Picker */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Color
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {GOAL_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: c,
                    borderWidth: color === c ? 3 : 0,
                    borderColor: '#FFFFFF',
                  }}
                />
              ))}
            </View>

            {/* Preview */}
            <View
              style={{
                borderRadius: 12,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: color + '18',
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: color + '30',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Feather name={icon as any} size={20} color={color} />
              </View>
              <View>
                <Text className="font-sans-semibold text-sm text-foreground">
                  {label || 'Goal Name'}
                </Text>
                <Text className="font-sans text-xs" style={{ color }}>
                  {isDebt ? 'Debt payoff' : 'Savings goal'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            className={`rounded-xl py-4 items-center mt-2 ${isValid ? 'bg-primary' : 'bg-background'}`}
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <Text className={`font-sans-semibold text-base ${isValid ? 'text-white' : 'text-muted-foreground'}`}>
              Create Goal
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
