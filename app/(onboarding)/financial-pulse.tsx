import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { OnboardingScreen } from '../../components/onboarding/onboarding-screen';
import { ContinueButton } from '../../components/onboarding/continue-button';

const PULSE_OPTIONS = [
  {
    id: 'tight',
    icon: 'alert-circle' as const,
    title: 'Tight budget',
    subtitle: "I'm careful with every zloty",
    strategy: '70-20-10',
  },
  {
    id: 'building',
    icon: 'trending-up' as const,
    title: 'Building up',
    subtitle: 'I have some room to save',
    strategy: '50-30-20',
  },
  {
    id: 'comfortable',
    icon: 'sun' as const,
    title: 'Comfortable',
    subtitle: 'I save regularly and want to grow',
    strategy: '60-20-20',
  },
  {
    id: 'debt',
    icon: 'credit-card' as const,
    title: 'Paying off debt',
    subtitle: 'Focused on reducing what I owe',
    strategy: '70-20-10',
  },
];

export default function FinancialPulseScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('building');

  const handleSelect = (id: string) => {
    Haptics.selectionAsync();
    setSelected(id);
  };

  const handleContinue = () => {
    const option = PULSE_OPTIONS.find((o) => o.id === selected)!;
    router.push({
      pathname: '/(onboarding)/budget-strategy',
      params: { pulse: option.strategy },
    });
  };

  return (
    <OnboardingScreen
      step={2}
      title="How's your financial life right now?"
      subtitle="This helps us suggest the right budget plan"
      canGoBack
      footer={<ContinueButton onPress={handleContinue} />}
    >
      <View className="gap-3">
        {PULSE_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option.id)}
              className={`rounded-xl p-4 ${isSelected ? '' : 'bg-card'}`}
              style={
                isSelected
                  ? { backgroundColor: '#1E40AF20', borderWidth: 1.5, borderColor: '#3B82F6' }
                  : { borderWidth: 1.5, borderColor: 'transparent' }
              }
            >
              <View className="flex-row items-center">
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: isSelected ? '#2563EB20' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Feather
                    name={option.icon}
                    size={22}
                    color={isSelected ? '#3B82F6' : '#94A3B8'}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-base text-foreground">
                    {option.title}
                  </Text>
                  <Text className="font-sans text-sm text-muted-foreground mt-0.5">
                    {option.subtitle}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScreen>
  );
}
