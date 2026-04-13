import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAllGoalsProgress } from '../../hooks/use-goal-progress';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { formatPLN, clamp } from '../../lib/utils';

export function GoalsSummary() {
  const goals = useAllGoalsProgress();
  const router = useRouter();
  const colors = useThemeColors();

  // Pick the incomplete goal closest to completion
  const featured = goals
    .filter((g) => g.percentage < 100)
    .sort((a, b) => b.percentage - a.percentage)[0];

  if (!featured) return null;

  const ratio = clamp(featured.percentage / 100, 0, 1);

  const barStyle = useAnimatedStyle(() => ({
    width: `${withTiming(ratio * 100, { duration: 600 })}%` as any,
    height: 6,
    borderRadius: 3,
    backgroundColor: featured.color,
  }));

  return (
    <View className="mx-4 mb-3">
      <Text className="font-sans-semibold text-sm text-foreground mb-3 px-1">
        Closest Goal
      </Text>
      <Pressable
        onPress={() => router.push('/goals' as any)}
        className="bg-card rounded-2xl p-4"
      >
        <View className="flex-row items-center mb-3">
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: featured.color + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Feather name={featured.icon as any} size={18} color={featured.color} />
          </View>
          <Text className="font-sans-medium text-sm text-foreground flex-1">
            {featured.label}
          </Text>
          <Text className="font-sans-bold text-sm" style={{ color: featured.color }}>
            {featured.percentage}%
          </Text>
        </View>

        {/* Progress bar */}
        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.trackBackground, overflow: 'hidden' }}>
          <Animated.View style={barStyle} />
        </View>

        <Text className="font-sans text-xs text-muted-foreground mt-2">
          {featured.isDebt
            ? `${formatPLN(featured.remaining)} remaining`
            : `${formatPLN(featured.contributed)} of ${formatPLN(featured.targetAmount)}`}
        </Text>
      </Pressable>
    </View>
  );
}
