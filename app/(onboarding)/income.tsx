import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/onboarding-screen';
import { ContinueButton } from '../../components/onboarding/continue-button';
import { AmountInput } from '../../components/transactions/amount-input';
import { useFinanceStore } from '../../stores/finance-store';

export default function IncomeScreen() {
  const router = useRouter();
  const setMonthlyIncome = useFinanceStore((s) => s.setMonthlyIncome);
  const currentIncome = useFinanceStore((s) => s.monthlyIncome);
  const [amount, setAmount] = useState(currentIncome);

  const handleContinue = () => {
    setMonthlyIncome(amount);
    router.push('/(onboarding)/financial-pulse');
  };

  return (
    <OnboardingScreen
      step={1}
      title="What do you earn each month?"
      subtitle="Your net (after-tax) monthly income"
      canGoBack
      footer={
        <ContinueButton onPress={handleContinue} disabled={amount <= 0} />
      }
    >
      <View className="mt-8">
        <AmountInput value={amount} onChange={setAmount} autoFocus />
      </View>
    </OnboardingScreen>
  );
}
