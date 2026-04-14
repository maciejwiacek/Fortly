import { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { getTodayStr } from '../../lib/utils';

interface GoalContributeSheetProps {
  goalId: string;
  goalLabel: string;
  onClose: () => void;
}

export function GoalContributeSheet({
  goalId,
  goalLabel,
  onClose,
}: GoalContributeSheetProps) {
  const addGoalContribution = useFinanceStore((s) => s.addGoalContribution);
  const colors = useThemeColors();
  const [amountText, setAmountText] = useState('');

  const handleSubmit = () => {
    const numericValue = parseFloat(amountText.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) return;

    addGoalContribution({
      goalId,
      amount: Math.round(numericValue * 100),
      date: getTodayStr(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const isValid = (() => {
    const num = parseFloat(amountText.replace(',', '.'));
    return !isNaN(num) && num > 0;
  })();

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-card rounded-t-3xl px-4 pb-10 pt-4">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-sans-semibold text-lg text-foreground">
              Add to {goalLabel}
            </Text>
            <Pressable onPress={onClose} className="p-2" hitSlop={8}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <View className="bg-background rounded-xl px-4 mb-4 flex-row items-center" style={{ minHeight: 52 }}>
            <TextInput
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              autoFocus
              selectionColor="#3B82F6"
              style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 20, color: '#F8FAFC', paddingVertical: 14 }}
            />
            <Text className="font-sans text-lg text-muted-foreground ml-2">zl</Text>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            className={`rounded-xl py-4 items-center ${isValid ? 'bg-primary' : 'bg-background'}`}
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <Text className={`font-sans-semibold text-base ${isValid ? 'text-white' : 'text-muted-foreground'}`}>
              Add Contribution
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
