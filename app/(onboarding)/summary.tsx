import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { OnboardingScreen } from '../../components/onboarding/onboarding-screen';
import { ContinueButton } from '../../components/onboarding/continue-button';
import { useFinanceStore } from '../../stores/finance-store';
import { formatPLN } from '../../lib/utils';

const STRATEGY_NAMES: Record<string, string> = {
  '50-30-20': '50 / 30 / 20',
  '60-20-20': '60 / 20 / 20',
  '70-20-10': '70 / 20 / 10',
  custom: 'Custom',
};

export default function SummaryScreen() {
  const router = useRouter();
  const monthlyIncome = useFinanceStore((s) => s.monthlyIncome);
  const budgetStrategy = useFinanceStore((s) => s.budgetStrategy);
  const goals = useFinanceStore((s) => s.goals);
  const completeOnboarding = useFinanceStore((s) => s.completeOnboarding);

  const firstGoal = goals.length > 0 ? goals[0] : null;

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <OnboardingScreen
      step={5}
      title="Your financial plan"
      subtitle="Here's what we've set up"
      canGoBack
      footer={<ContinueButton label="Start Tracking" onPress={handleConfirm} />}
    >
      <View className="gap-4">
        {/* Income Card */}
        <Pressable
          onPress={() => router.navigate('/(onboarding)/income')}
          className="bg-card rounded-2xl p-4"
          style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-sans-medium text-sm text-muted-foreground">Monthly Income</Text>
            <Feather name="edit-2" size={16} color="#94A3B8" />
          </View>
          <Text className="font-sans-bold text-2xl text-foreground">
            {formatPLN(monthlyIncome)}
          </Text>
        </Pressable>

        {/* Strategy Card */}
        <Pressable
          onPress={() => router.navigate('/(onboarding)/budget-strategy')}
          className="bg-card rounded-2xl p-4"
          style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-sans-medium text-sm text-muted-foreground">Budget Strategy</Text>
            <Feather name="edit-2" size={16} color="#94A3B8" />
          </View>
          <Text className="font-sans-semibold text-lg text-foreground mb-3">
            {STRATEGY_NAMES[budgetStrategy.type] || budgetStrategy.type}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-background rounded-lg py-2 items-center">
              <Text className="font-sans-bold text-sm text-foreground">
                {formatPLN(Math.round((monthlyIncome * budgetStrategy.needs) / 100))}
              </Text>
              <Text className="font-sans text-xs text-muted-foreground">
                Needs {budgetStrategy.needs}%
              </Text>
            </View>
            <View className="flex-1 bg-background rounded-lg py-2 items-center">
              <Text className="font-sans-bold text-sm text-warning">
                {formatPLN(Math.round((monthlyIncome * budgetStrategy.wants) / 100))}
              </Text>
              <Text className="font-sans text-xs text-muted-foreground">
                Wants {budgetStrategy.wants}%
              </Text>
            </View>
            <View className="flex-1 bg-background rounded-lg py-2 items-center">
              <Text className="font-sans-bold text-sm text-success">
                {formatPLN(Math.round((monthlyIncome * budgetStrategy.savings) / 100))}
              </Text>
              <Text className="font-sans text-xs text-muted-foreground">
                Save {budgetStrategy.savings}%
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Goal Card */}
        <Pressable
          onPress={() => router.navigate('/(onboarding)/first-goal')}
          className="bg-card rounded-2xl p-4"
          style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-sans-medium text-sm text-muted-foreground">First Goal</Text>
            <Feather name="edit-2" size={16} color="#94A3B8" />
          </View>
          {firstGoal ? (
            <View className="flex-row items-center">
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: firstGoal.color + '30',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Feather name={firstGoal.icon as any} size={22} color={firstGoal.color} />
              </View>
              <View>
                <Text className="font-sans-semibold text-base text-foreground">
                  {firstGoal.label}
                </Text>
                <Text className="font-sans text-sm text-muted-foreground">
                  {formatPLN(firstGoal.targetAmount)} · {firstGoal.isDebt ? 'Debt payoff' : 'Savings goal'}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="font-sans text-base text-muted-foreground">
              No goal yet — add one anytime
            </Text>
          )}
        </Pressable>
      </View>
    </OnboardingScreen>
  );
}
