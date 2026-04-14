import { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { OnboardingScreen } from '../../components/onboarding/onboarding-screen';
import { ContinueButton } from '../../components/onboarding/continue-button';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';

const ICON_SUBSET = ['home', 'monitor', 'truck', 'briefcase', 'star', 'heart', 'target', 'gift'] as const;
const COLOR_SUBSET = ['#F43F5E', '#8B5CF6', '#06B6D4', '#F97316', '#10B981', '#6366F1'];

export default function FirstGoalScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const addGoal = useFinanceStore((s) => s.addGoal);

  const [label, setLabel] = useState('');
  const [targetText, setTargetText] = useState('');
  const [icon, setIcon] = useState<string>('target');
  const [color, setColor] = useState('#8B5CF6');
  const [isDebt, setIsDebt] = useState(false);

  const isValid = label.trim().length > 0 && (() => {
    const num = parseFloat(targetText.replace(',', '.'));
    return !isNaN(num) && num > 0;
  })();

  const handleContinue = () => {
    const target = parseFloat(targetText.replace(',', '.'));
    addGoal({
      label: label.trim(),
      icon,
      color,
      targetAmount: Math.round(target * 100),
      isDebt,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(onboarding)/summary');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/summary');
  };

  return (
    <OnboardingScreen
      step={4}
      title="What are you saving for?"
      subtitle="Set your first target (you can add more later)"
      canGoBack
      footer={
        <View>
          <ContinueButton onPress={handleContinue} disabled={!isValid} />
          <Pressable onPress={handleSkip} className="py-3 items-center mt-1">
            <Text className="font-sans-medium text-sm text-muted-foreground">
              Skip for now
            </Text>
          </Pressable>
        </View>
      }
    >
      <View className="gap-4">
        {/* Name */}
        <View>
          <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Name</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. New Car, Vacation, Emergency Fund"
            placeholderTextColor={colors.muted}
            selectionColor={colors.primaryLight}
            style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.foreground }}
          />
        </View>

        {/* Target Amount */}
        <View>
          <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Target Amount (PLN)</Text>
          <View className="bg-card rounded-xl px-4 flex-row items-center" style={{ minHeight: 52 }}>
            <TextInput
              value={targetText}
              onChangeText={setTargetText}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.muted}
              selectionColor={colors.primaryLight}
              style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 18, color: colors.foreground, paddingVertical: 14 }}
            />
            <Text className="font-sans text-lg text-muted-foreground ml-2">zl</Text>
          </View>
        </View>

        {/* Is Debt */}
        <View className="bg-card rounded-xl px-4 py-3 flex-row items-center justify-between">
          <View>
            <Text className="font-sans-medium text-sm text-foreground">This is a debt</Text>
            <Text className="font-sans text-xs text-muted-foreground">
              Shows remaining amount instead of saved
            </Text>
          </View>
          <Switch
            value={isDebt}
            onValueChange={setIsDebt}
            trackColor={{ false: colors.border, true: '#F43F5E' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Icon Picker */}
        <View>
          <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Icon</Text>
          <View className="flex-row flex-wrap gap-2">
            {ICON_SUBSET.map((iconName) => (
              <Pressable
                key={iconName}
                onPress={() => { setIcon(iconName); Haptics.selectionAsync(); }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: icon === iconName ? color + '30' : colors.card,
                  borderWidth: icon === iconName ? 1.5 : 0,
                  borderColor: icon === iconName ? color : 'transparent',
                }}
              >
                <Feather
                  name={iconName as any}
                  size={22}
                  color={icon === iconName ? color : colors.mutedForeground}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Color Picker */}
        <View>
          <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Color</Text>
          <View className="flex-row flex-wrap gap-3">
            {COLOR_SUBSET.map((c) => (
              <Pressable
                key={c}
                onPress={() => { setColor(c); Haptics.selectionAsync(); }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 0,
                  borderColor: colors.foreground,
                }}
              />
            ))}
          </View>
        </View>

        {/* Preview */}
        <View
          style={{
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: color + '18',
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

        <View style={{ height: 40 }} />
      </View>
    </OnboardingScreen>
  );
}
