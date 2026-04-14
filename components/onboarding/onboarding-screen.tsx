import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { ProgressDots } from './progress-dots';

interface OnboardingScreenProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function OnboardingScreen({
  step,
  totalSteps = 5,
  title,
  subtitle,
  canGoBack = true,
  children,
  footer,
}: OnboardingScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5">
          <View className="flex-row items-center h-12">
            {canGoBack && (
              <Pressable onPress={() => router.back()} className="p-2 -ml-2" hitSlop={8}>
                <Feather name="arrow-left" size={24} color={colors.foreground} />
              </Pressable>
            )}
          </View>
          <ProgressDots step={step} total={totalSteps} />
        </View>

        {/* Title */}
        <View className="px-5 mt-4 mb-6">
          <Text className="font-sans-bold text-2xl text-foreground">{title}</Text>
          {subtitle && (
            <Text className="font-sans text-base text-muted-foreground mt-2">{subtitle}</Text>
          )}
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {/* Footer */}
        <View className="px-5 pb-4 pt-2">
          {footer}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
