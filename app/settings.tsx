import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '../stores/finance-store';
import { formatPLN } from '../lib/utils';
import { BUDGET_STRATEGIES, type BudgetStrategyType, type CustomMode, type ThemePreference } from '../lib/types';
import { useTheme } from '../hooks/use-theme';
import { useThemeColors } from '../hooks/use-theme-colors';

const STRATEGY_INFO: Record<BudgetStrategyType, { name: string; description: string }> = {
  '50-30-20': {
    name: '50 / 30 / 20',
    description: 'Classic rule: 50% needs, 30% wants, 20% savings',
  },
  '60-20-20': {
    name: '60 / 20 / 20',
    description: 'Conservative: 60% needs, 20% wants, 20% savings',
  },
  '70-20-10': {
    name: '70 / 20 / 10',
    description: 'High expenses: 70% needs, 20% wants, 10% savings',
  },
  custom: {
    name: 'Custom',
    description: 'Set your own percentages or fixed PLN amounts',
  },
};

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'system', label: 'System', icon: 'smartphone' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { themePreference } = useTheme();
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const budgetStrategy = useFinanceStore((s) => s.budgetStrategy);
  const setBudgetStrategy = useFinanceStore((s) => s.setBudgetStrategy);
  const setMonthlyIncome = useFinanceStore((s) => s.setMonthlyIncome);
  const setThemePreference = useFinanceStore((s) => s.setThemePreference);

  const [incomeText, setIncomeText] = useState((monthlyIncome / 100).toFixed(0));
  const [customNeeds, setCustomNeeds] = useState(String(budgetStrategy.needs));
  const [customWants, setCustomWants] = useState(String(budgetStrategy.wants));
  const [customSavings, setCustomSavings] = useState(String(budgetStrategy.savings));
  const [customMode, setCustomMode] = useState<CustomMode>(budgetStrategy.customMode ?? 'percentage');
  const [fixedNeeds, setFixedNeeds] = useState(String((budgetStrategy.fixedNeeds ?? 0) / 100));
  const [fixedWants, setFixedWants] = useState(String((budgetStrategy.fixedWants ?? 0) / 100));
  const [fixedSavings, setFixedSavings] = useState(String((budgetStrategy.fixedSavings ?? 0) / 100));
  const [savedIncome, setSavedIncome] = useState(false);
  const [savedCustom, setSavedCustom] = useState(false);

  const handleSaveIncome = () => {
    const newIncome = Math.round(parseFloat(incomeText.replace(',', '.')) * 100);
    if (isNaN(newIncome) || newIncome <= 0) {
      Alert.alert('Invalid', 'Please enter a valid amount');
      return;
    }
    setMonthlyIncome(newIncome);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSavedIncome(true);
    setTimeout(() => setSavedIncome(false), 2000);
  };

  const handleStrategySelect = (type: BudgetStrategyType) => {
    Haptics.selectionAsync();
    if (type === 'custom') {
      const n = parseInt(customNeeds) || 50;
      const w = parseInt(customWants) || 30;
      const s = parseInt(customSavings) || 20;
      setBudgetStrategy({ type: 'custom', needs: n, wants: w, savings: s });
    } else {
      setBudgetStrategy(BUDGET_STRATEGIES[type]);
    }
  };

  const handleSaveCustom = () => {
    if (customMode === 'percentage') {
      const n = parseInt(customNeeds) || 0;
      const w = parseInt(customWants) || 0;
      const s = parseInt(customSavings) || 0;
      if (n + w + s !== 100) {
        Alert.alert('Must add to 100%', `Currently ${n}+${w}+${s} = ${n + w + s}%`);
        return;
      }
      setBudgetStrategy({ type: 'custom', customMode: 'percentage', needs: n, wants: w, savings: s });
    } else {
      const fn = Math.round((parseFloat(fixedNeeds.replace(',', '.')) || 0) * 100);
      const fw = Math.round((parseFloat(fixedWants.replace(',', '.')) || 0) * 100);
      const fs = Math.round((parseFloat(fixedSavings.replace(',', '.')) || 0) * 100);
      if (fn <= 0 && fw <= 0 && fs <= 0) {
        Alert.alert('Invalid', 'Enter at least one amount');
        return;
      }
      setBudgetStrategy({
        type: 'custom',
        customMode: 'fixed',
        needs: 0, wants: 0, savings: 0,
        fixedNeeds: fn, fixedWants: fw, fixedSavings: fs,
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSavedCustom(true);
    setTimeout(() => setSavedCustom(false), 2000);
  };

  const income = monthlyIncome;

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your data and return you to the setup screen. Cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            useFinanceStore.setState({
              isOnboardingComplete: false,
              monthlyIncome: 0,
              budgetStrategy: BUDGET_STRATEGIES['50-30-20'],
              transactions: [],
              goals: [],
              goalContributions: [],
              investmentEntries: [],
              chatMessages: [],
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2 mr-2" hitSlop={8}>
            <Feather name="arrow-left" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="font-sans-bold text-2xl text-foreground">Settings</Text>
        </View>

        <View className="px-4 mt-2">
          {/* Theme Preference */}
          <Text className="font-sans-semibold text-sm text-foreground mb-2">
            Appearance
          </Text>
          <View className="flex-row gap-2 mb-6">
            {THEME_OPTIONS.map((option) => {
              const isSelected = themePreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => { setThemePreference(option.value); Haptics.selectionAsync(); }}
                  className={`flex-1 rounded-xl py-3 items-center ${isSelected ? '' : 'bg-card'}`}
                  style={
                    isSelected
                      ? { backgroundColor: colors.primary + '18', borderWidth: 1.5, borderColor: colors.primary }
                      : { borderWidth: 1.5, borderColor: 'transparent' }
                  }
                >
                  <Feather
                    name={option.icon as any}
                    size={18}
                    color={isSelected ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    className={`font-sans-medium text-xs mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Monthly Income */}
          <Text className="font-sans-semibold text-sm text-foreground mb-2">
            Monthly Net Income
          </Text>
          <View className="bg-card rounded-xl px-4 flex-row items-center mb-2" style={{ minHeight: 52 }}>
            <TextInput
              value={incomeText}
              onChangeText={setIncomeText}
              keyboardType="decimal-pad"
              placeholderTextColor={colors.muted}
              selectionColor={colors.primaryLight}
              style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 18, color: colors.foreground, paddingVertical: 14 }}
            />
            <Text className="font-sans text-lg text-muted-foreground">zl</Text>
          </View>
          <Pressable
            onPress={handleSaveIncome}
            className={`rounded-xl py-3 items-center mb-6 ${savedIncome ? 'bg-success' : 'bg-primary'}`}
          >
            <Text className="font-sans-semibold text-sm text-white">
              {savedIncome ? 'Saved!' : 'Update Income'}
            </Text>
          </Pressable>

          {/* Budget Strategy */}
          <Text className="font-sans-semibold text-sm text-foreground mb-1">
            Budget Strategy
          </Text>
          <Text className="font-sans text-xs text-muted-foreground mb-3">
            Choose how to split your income between needs, wants, and savings
          </Text>

          {(Object.keys(STRATEGY_INFO) as BudgetStrategyType[]).map((type) => {
            const info = STRATEGY_INFO[type];
            const isSelected = budgetStrategy.type === type;
            const strat = type === 'custom' ? budgetStrategy : BUDGET_STRATEGIES[type];

            return (
              <Pressable
                key={type}
                onPress={() => handleStrategySelect(type)}
                className={`rounded-xl p-4 mb-2 ${isSelected ? '' : 'bg-card'}`}
                style={
                  isSelected
                    ? { backgroundColor: colors.primary + '18', borderWidth: 1.5, borderColor: colors.primary }
                    : { borderWidth: 1.5, borderColor: 'transparent' }
                }
              >
                <Text className="font-sans-semibold text-base text-foreground">
                  {info.name}
                </Text>
                <Text className="font-sans text-xs text-muted-foreground mt-0.5">
                  {info.description}
                </Text>
                {isSelected && type !== 'custom' && (
                  <View className="flex-row mt-3 gap-2">
                    <View className="flex-1 bg-background rounded-lg py-2 items-center">
                      <Text className="font-sans-bold text-sm text-foreground">
                        {formatPLN(Math.round((income * strat.needs) / 100))}
                      </Text>
                      <Text className="font-sans text-xs text-muted-foreground">
                        Needs {strat.needs}%
                      </Text>
                    </View>
                    <View className="flex-1 bg-background rounded-lg py-2 items-center">
                      <Text className="font-sans-bold text-sm text-warning">
                        {formatPLN(Math.round((income * strat.wants) / 100))}
                      </Text>
                      <Text className="font-sans text-xs text-muted-foreground">
                        Wants {strat.wants}%
                      </Text>
                    </View>
                    <View className="flex-1 bg-background rounded-lg py-2 items-center">
                      <Text className="font-sans-bold text-sm text-success">
                        {formatPLN(Math.round((income * strat.savings) / 100))}
                      </Text>
                      <Text className="font-sans text-xs text-muted-foreground">
                        Save {strat.savings}%
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* Custom strategy inputs */}
          {budgetStrategy.type === 'custom' && (
            <View className="bg-card rounded-xl p-4 mb-2">
              <View className="flex-row bg-background rounded-lg p-1 mb-4">
                <Pressable
                  onPress={() => { setCustomMode('percentage'); Haptics.selectionAsync(); }}
                  className={`flex-1 py-2 rounded-md items-center ${customMode === 'percentage' ? 'bg-primary' : ''}`}
                >
                  <Text className={`font-sans-medium text-sm ${customMode === 'percentage' ? 'text-white' : 'text-muted-foreground'}`}>
                    Percentage
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => { setCustomMode('fixed'); Haptics.selectionAsync(); }}
                  className={`flex-1 py-2 rounded-md items-center ${customMode === 'fixed' ? 'bg-primary' : ''}`}
                >
                  <Text className={`font-sans-medium text-sm ${customMode === 'fixed' ? 'text-white' : 'text-muted-foreground'}`}>
                    Fixed PLN
                  </Text>
                </Pressable>
              </View>

              {customMode === 'percentage' ? (
                <>
                  <Text className="font-sans-medium text-sm text-foreground mb-3">
                    Split by % (must add to 100)
                  </Text>
                  <View className="flex-row gap-2 mb-3">
                    {[{ label: 'Needs %', value: customNeeds, setter: setCustomNeeds },
                      { label: 'Wants %', value: customWants, setter: setCustomWants },
                      { label: 'Save %', value: customSavings, setter: setCustomSavings }].map((field) => (
                      <View key={field.label} className="flex-1">
                        <Text className="font-sans text-xs text-muted-foreground mb-1">{field.label}</Text>
                        <TextInput
                          value={field.value}
                          onChangeText={field.setter}
                          keyboardType="number-pad"
                          selectionColor={colors.primaryLight}
                          style={{ backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_500Medium', color: colors.foreground, textAlign: 'center' }}
                        />
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <Text className="font-sans-medium text-sm text-foreground mb-3">
                    Set exact PLN amounts
                  </Text>
                  <View className="flex-row gap-2 mb-3">
                    {[{ label: 'Needs', value: fixedNeeds, setter: setFixedNeeds },
                      { label: 'Wants', value: fixedWants, setter: setFixedWants },
                      { label: 'Save', value: fixedSavings, setter: setFixedSavings }].map((field) => (
                      <View key={field.label} className="flex-1">
                        <Text className="font-sans text-xs text-muted-foreground mb-1">{field.label}</Text>
                        <TextInput
                          value={field.value}
                          onChangeText={field.setter}
                          keyboardType="decimal-pad"
                          placeholder="0"
                          placeholderTextColor={colors.muted}
                          selectionColor={colors.primaryLight}
                          style={{ backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_500Medium', color: colors.foreground, textAlign: 'center' }}
                        />
                      </View>
                    ))}
                  </View>
                  <Text className="font-sans text-xs text-muted-foreground mb-2">
                    Total: {formatPLN(
                      Math.round((parseFloat(fixedNeeds.replace(',','.')) || 0) * 100) +
                      Math.round((parseFloat(fixedWants.replace(',','.')) || 0) * 100) +
                      Math.round((parseFloat(fixedSavings.replace(',','.')) || 0) * 100)
                    )} / {formatPLN(monthlyIncome)}
                  </Text>
                </>
              )}

              <Pressable
                onPress={handleSaveCustom}
                className={`rounded-lg py-2.5 items-center ${savedCustom ? 'bg-success' : 'bg-primary'}`}
              >
                <Text className="font-sans-medium text-sm text-white">
                  {savedCustom ? 'Saved!' : 'Apply'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Danger zone */}
          <View className="mt-8 mb-8">
            <Text className="font-sans-medium text-sm text-destructive mb-2">
              Danger Zone
            </Text>
            <Pressable
              onPress={handleReset}
              className="rounded-xl py-4 items-center"
              style={{
                backgroundColor: 'rgba(220,38,38,0.1)',
                borderWidth: 1,
                borderColor: 'rgba(220,38,38,0.2)',
              }}
            >
              <Text className="font-sans-semibold text-base text-destructive">
                Reset All Data
              </Text>
            </Pressable>
          </View>
        </View>

        <SafeAreaView edges={['bottom']} style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
