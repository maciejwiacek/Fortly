import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { OnboardingScreen } from '../../components/onboarding/onboarding-screen';
import { ContinueButton } from '../../components/onboarding/continue-button';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { BUDGET_STRATEGIES, type BudgetStrategyType } from '../../lib/types';
import { formatPLN } from '../../lib/utils';

const STRATEGY_INFO: Record<string, { name: string; description: string }> = {
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
};

const STRATEGY_TYPES: BudgetStrategyType[] = ['50-30-20', '60-20-20', '70-20-10'];

export default function BudgetStrategyScreen() {
  const router = useRouter();
  const { pulse } = useLocalSearchParams<{ pulse?: string }>();
  const setBudgetStrategy = useFinanceStore((s) => s.setBudgetStrategy);
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const currentStrategy = useFinanceStore((s) => s.budgetStrategy);

  const initialStrategy = (pulse as BudgetStrategyType) || currentStrategy.type;
  const [selected, setSelected] = useState<BudgetStrategyType>(
    STRATEGY_TYPES.includes(initialStrategy as BudgetStrategyType) ? initialStrategy as BudgetStrategyType : '50-30-20'
  );

  const colors = useThemeColors();
  const recommendedType = pulse as string;

  const handleSelect = (type: BudgetStrategyType) => {
    Haptics.selectionAsync();
    setSelected(type);
  };

  const handleContinue = () => {
    setBudgetStrategy(BUDGET_STRATEGIES[selected]);
    router.push('/(onboarding)/first-goal');
  };

  return (
    <OnboardingScreen
      step={3}
      title="Your budget plan"
      subtitle={
        recommendedType
          ? `Based on your profile, we recommend ${STRATEGY_INFO[recommendedType]?.name || '50/30/20'}`
          : 'Choose how to split your income'
      }
      canGoBack
      footer={
        <View>
          <ContinueButton onPress={handleContinue} />
          <Text className="font-sans text-xs text-muted-foreground text-center mt-3">
            You can customize this later in Settings
          </Text>
        </View>
      }
    >
      <View className="gap-3">
        {STRATEGY_TYPES.map((type) => {
          const info = STRATEGY_INFO[type];
          const strat = BUDGET_STRATEGIES[type];
          const isSelected = selected === type;
          const isRecommended = type === recommendedType;

          return (
            <Pressable
              key={type}
              onPress={() => handleSelect(type)}
              className={`rounded-xl p-4 ${isSelected ? '' : 'bg-card'}`}
              style={
                isSelected
                  ? { backgroundColor: colors.primary + '15', borderWidth: 1.5, borderColor: colors.primary }
                  : { borderWidth: 1.5, borderColor: 'transparent' }
              }
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-semibold text-base text-foreground">
                  {info.name}
                </Text>
                {isRecommended && (
                  <View className="bg-primary rounded-full px-2 py-0.5">
                    <Text className="font-sans-medium text-xs text-white">Recommended</Text>
                  </View>
                )}
              </View>
              <Text className="font-sans text-xs text-muted-foreground mt-0.5">
                {info.description}
              </Text>

              {isSelected && (
                <View className="flex-row mt-3 gap-2">
                  <View className="flex-1 bg-background rounded-lg py-2 items-center">
                    <Text className="font-sans-bold text-sm text-foreground">
                      {formatPLN(Math.round((monthlyIncome * strat.needs) / 100))}
                    </Text>
                    <Text className="font-sans text-xs text-muted-foreground">
                      Needs {strat.needs}%
                    </Text>
                  </View>
                  <View className="flex-1 bg-background rounded-lg py-2 items-center">
                    <Text className="font-sans-bold text-sm text-warning">
                      {formatPLN(Math.round((monthlyIncome * strat.wants) / 100))}
                    </Text>
                    <Text className="font-sans text-xs text-muted-foreground">
                      Wants {strat.wants}%
                    </Text>
                  </View>
                  <View className="flex-1 bg-background rounded-lg py-2 items-center">
                    <Text className="font-sans-bold text-sm text-success">
                      {formatPLN(Math.round((monthlyIncome * strat.savings) / 100))}
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
      </View>
    </OnboardingScreen>
  );
}
