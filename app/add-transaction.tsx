import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { AmountInput } from '../components/transactions/amount-input';
import { CategoryPicker } from '../components/transactions/category-picker';
import { useFinanceStore } from '../stores/finance-store';
import { useThemeColors } from '../hooks/use-theme-colors';
import { CATEGORIES, TICKER_PRESETS } from '../lib/constants';
import { getTodayStr, formatPLN } from '../lib/utils';
import type { TransactionCategory } from '../lib/types';

type AddMode = 'expense' | 'goal' | 'investment';

export default function AddTransactionScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const addGoalContribution = useFinanceStore((s) => s.addGoalContribution);
  const addInvestment = useFinanceStore((s) => s.addInvestment);
  const goals = useFinanceStore((s) => s.goals);

  const [mode, setMode] = useState<AddMode>('expense');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<TransactionCategory | null>(null);
  const [isEnvelope, setIsEnvelope] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? '');
  const [investLabel, setInvestLabel] = useState('');
  const [investTicker, setInvestTicker] = useState('');
  const [investNote, setInvestNote] = useState('');
  const [date] = useState(getTodayStr());

  const handleCategorySelect = (cat: TransactionCategory) => {
    setCategory(cat);
    const catConfig = CATEGORIES.find((c) => c.value === cat);
    if (catConfig) setIsEnvelope(catConfig.isEnvelopeDefault);
  };

  const handleSubmit = () => {
    if (mode === 'expense') {
      if (amount <= 0 || !category) return;
      addTransaction({ amount, category, date, isEnvelope });
    } else if (mode === 'goal') {
      if (amount <= 0 || !selectedGoalId) return;
      addGoalContribution({ goalId: selectedGoalId, amount, date });
    } else {
      if (amount <= 0 || !investLabel.trim()) return;
      addInvestment({
        label: investLabel.trim(),
        amount,
        date,
        note: investNote.trim() || undefined,
        ticker: investTicker.trim().toUpperCase() || undefined,
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const isValid =
    (mode === 'expense' && amount > 0 && category !== null) ||
    (mode === 'goal' && amount > 0 && selectedGoalId) ||
    (mode === 'investment' && amount > 0 && investLabel.trim().length > 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="font-sans-semibold text-lg text-foreground">Add</Text>
          <Pressable onPress={() => router.back()} className="p-2" hitSlop={8}>
            <Feather name="x" size={24} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Mode Selector */}
        <View className="flex-row mx-4 mb-4 bg-card rounded-xl p-1">
          {(['expense', 'goal', 'investment'] as AddMode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => {
                setMode(m);
                Haptics.selectionAsync();
              }}
              className={`flex-1 py-2.5 rounded-lg items-center ${mode === m ? 'bg-primary' : ''}`}
            >
              <Text
                className={`font-sans-medium text-sm capitalize ${
                  mode === m ? 'text-white' : 'text-muted-foreground'
                }`}
              >
                {m === 'investment' ? 'Invest' : m}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Amount (shared for all modes except old investment toggle) */}
          <AmountInput value={amount} onChange={setAmount} autoFocus />

          {/* ── EXPENSE MODE ── */}
          {mode === 'expense' && (
            <>
              <View className="px-4 mb-4">
                <View className="bg-card rounded-lg px-3 py-2 self-start flex-row items-center">
                  <Text className="font-sans-medium text-sm text-foreground">
                    {date === getTodayStr() ? 'Dzisiaj' : date}
                  </Text>
                  <Feather name="chevron-down" size={14} color={colors.mutedForeground} style={{ marginLeft: 4 }} />
                </View>
              </View>
              <View className="px-2 mb-4">
                <Text className="font-sans-medium text-sm text-muted-foreground px-2 mb-3">
                  Category
                </Text>
                <CategoryPicker selected={category} onSelect={handleCategorySelect} />
              </View>
              <View className="mx-4 bg-card rounded-xl px-4 py-3 flex-row items-center justify-between mb-4">
                <View>
                  <Text className="font-sans-medium text-sm text-foreground">Wants Spending</Text>
                  <Text className="font-sans text-xs text-muted-foreground">
                    Counts toward your wants limit
                  </Text>
                </View>
                <Switch
                  value={isEnvelope}
                  onValueChange={setIsEnvelope}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          )}

          {/* ── GOAL MODE ── */}
          {mode === 'goal' && (
            <View className="px-4 mb-4">
              <Text className="font-sans-medium text-sm text-muted-foreground mb-3">
                Choose Goal
              </Text>
              {goals.length === 0 ? (
                <View className="items-center py-6">
                  <Text className="font-sans text-sm text-muted-foreground">
                    No goals yet — create one in the Goals tab
                  </Text>
                </View>
              ) : (
                goals.map((goal) => (
                  <Pressable
                    key={goal.id}
                    onPress={() => setSelectedGoalId(goal.id)}
                    className={`rounded-xl p-4 mb-2 flex-row items-center`}
                    style={{
                      backgroundColor: selectedGoalId === goal.id ? goal.color + '20' : colors.card,
                      borderWidth: 1.5,
                      borderColor: selectedGoalId === goal.id ? goal.color : 'transparent',
                    }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: goal.color + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Feather name={(goal.icon || 'target') as any} size={20} color={goal.color} />
                    </View>
                    <View>
                      <Text className="font-sans-semibold text-base text-foreground">
                        {goal.label}
                      </Text>
                      <Text className="font-sans text-xs text-muted-foreground">
                        Target: {formatPLN(goal.targetAmount)}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {/* ── INVESTMENT MODE ── */}
          {mode === 'investment' && (
            <View className="px-4 mb-4">
              <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
                Quick Select Ticker
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row gap-2">
                  {TICKER_PRESETS.map((preset) => (
                    <Pressable
                      key={preset.ticker}
                      onPress={() => {
                        setInvestTicker(preset.ticker);
                        setInvestLabel(preset.label);
                        Haptics.selectionAsync();
                      }}
                      className={`rounded-xl px-3 py-2 ${
                        investTicker === preset.ticker ? 'bg-primary' : 'bg-card'
                      }`}
                    >
                      <Text
                        className={`font-sans-semibold text-xs ${
                          investTicker === preset.ticker ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {preset.ticker}
                      </Text>
                      <Text
                        className={`font-sans text-xs ${
                          investTicker === preset.ticker ? 'text-white/70' : 'text-muted-foreground'
                        }`}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              <TextInput
                value={investTicker}
                onChangeText={setInvestTicker}
                placeholder="Or type ticker (VOO, BTC-USD...)"
                placeholderTextColor={colors.muted}
                autoCapitalize="characters"
                selectionColor={colors.primaryLight}
                style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.foreground, marginBottom: 12 }}
              />

              <TextInput
                value={investLabel}
                onChangeText={setInvestLabel}
                placeholder="Investment name"
                placeholderTextColor={colors.muted}
                selectionColor={colors.primaryLight}
                style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.foreground, marginBottom: 12 }}
              />
              <TextInput
                value={investNote}
                onChangeText={setInvestNote}
                placeholder="Note (optional)"
                placeholderTextColor={colors.muted}
                selectionColor={colors.primaryLight}
                style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.foreground }}
              />
            </View>
          )}
        </ScrollView>

        {/* Submit */}
        <View className="px-4 pb-4">
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            className={`rounded-xl py-4 items-center ${isValid ? 'bg-primary' : 'bg-card'}`}
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <Text
              className={`font-sans-semibold text-base ${isValid ? 'text-white' : 'text-muted-foreground'}`}
            >
              {mode === 'expense'
                ? 'Add Expense'
                : mode === 'goal'
                ? 'Add Contribution'
                : 'Log Investment'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
