import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useDerivedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { GoalProgress } from '../../hooks/use-goal-progress';
import { formatPLN, clamp } from '../../lib/utils';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { useTheme } from '../../hooks/use-theme';
import { GoalContributeSheet } from './goal-contribute-sheet';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GoalCardProps {
  goal: GoalProgress;
}

function getMilestoneLabel(pct: number): string {
  if (pct >= 100) return 'Complete!';
  if (pct >= 75) return 'Almost there!';
  if (pct >= 50) return 'Halfway!';
  if (pct >= 25) return 'Getting started';
  return '';
}

export function GoalCard({ goal }: GoalCardProps) {
  const [showContribute, setShowContribute] = useState(false);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);
  const colors = useThemeColors();
  const { isDark } = useTheme();

  const gaugeSize = 100;
  const strokeWidth = 8;
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = clamp(goal.percentage / 100, 0, 1);

  const animatedRatio = useDerivedValue(() => withTiming(ratio, { duration: 800 }), [ratio]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedRatio.value),
  }));

  const milestoneLabel = getMilestoneLabel(goal.percentage);
  const inactiveDot = isDark ? '#333333' : '#E0E0E0';
  const buttonBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      `Delete "${goal.label}" and all its contributions?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteGoal(goal.id);
          },
        },
      ]
    );
  };

  return (
    <>
      <View
        className="bg-card rounded-2xl p-4 mx-4 mb-3"
        style={{ borderWidth: 1, borderColor: colors.border }}
      >
        <View className="flex-row items-center">
          {/* Circular gauge */}
          <View style={{ width: gaugeSize, height: gaugeSize }} className="mr-4">
            <Svg width={gaugeSize} height={gaugeSize}>
              <Circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={radius}
                stroke={colors.trackBackground}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={radius}
                stroke={goal.isComplete ? colors.success : goal.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                strokeLinecap="round"
                rotation="-90"
                origin={`${gaugeSize / 2}, ${gaugeSize / 2}`}
              />
            </Svg>
            <View
              className="absolute items-center justify-center"
              style={{ width: gaugeSize, height: gaugeSize }}
            >
              <Feather name={goal.icon as any} size={22} color={goal.isComplete ? colors.success : goal.color} />
              <Text
                className="font-sans-bold text-xs"
                style={{ color: goal.isComplete ? colors.success : goal.color }}
              >
                {goal.percentage}%
              </Text>
            </View>
          </View>

          {/* Info */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-sans-semibold text-base text-foreground flex-1">
                {goal.label}
              </Text>
              <Pressable onPress={handleDelete} className="p-1.5" hitSlop={8}>
                <Feather name="trash-2" size={14} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {goal.isDebt ? (
              <Text className="font-sans text-sm text-muted-foreground mt-1">
                {formatPLN(goal.remaining)}{' '}
                <Text className="text-xs">remaining</Text>
              </Text>
            ) : (
              <Text className="font-sans text-sm text-muted-foreground mt-1">
                {formatPLN(goal.contributed)}{' '}
                <Text className="text-xs">/ {formatPLN(goal.targetAmount)}</Text>
              </Text>
            )}

            {milestoneLabel ? (
              <View
                className="self-start rounded-full px-2.5 py-1 mt-2"
                style={{ backgroundColor: goal.color + '15' }}
              >
                <Text
                  className="font-sans-medium text-xs"
                  style={{ color: goal.color }}
                >
                  {milestoneLabel}
                </Text>
              </View>
            ) : null}

            {/* Milestone dots */}
            <View className="flex-row mt-2 gap-1.5">
              {[25, 50, 75, 100].map((m) => (
                <View
                  key={m}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      goal.percentage >= m
                        ? goal.isComplete ? colors.success : goal.color
                        : inactiveDot,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Add button */}
        {!goal.isComplete && (
          <Pressable
            onPress={() => setShowContribute(true)}
            className="mt-3 rounded-xl py-3 items-center flex-row justify-center"
            style={{ backgroundColor: buttonBg }}
          >
            <Feather name="plus" size={16} color={goal.color} />
            <Text className="font-sans-medium text-sm ml-1.5" style={{ color: goal.color }}>
              Add Contribution
            </Text>
          </Pressable>
        )}
      </View>

      {showContribute && (
        <GoalContributeSheet
          goalId={goal.id}
          goalLabel={goal.label}
          onClose={() => setShowContribute(false)}
        />
      )}
    </>
  );
}
