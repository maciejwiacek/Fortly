import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useBudgetAllocation } from '../../hooks/use-envelope-status';
import { useMonthlyTransactions } from '../../hooks/use-monthly-transactions';
import { useFinanceStore } from '../../stores/finance-store';
import { formatPLN, getCurrentMonthKey, getMonthKey, clamp } from '../../lib/utils';
import { NEEDS_CATEGORIES, WANTS_CATEGORIES } from '../../lib/types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MiniGaugeProps {
  label: string;
  spent: number;
  budget: number;
  color: string;
}

function MiniGauge({ label, spent, budget, color }: MiniGaugeProps) {
  const size = 90;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = clamp(budget > 0 ? spent / budget : 0, 0, 1);
  const percentage = Math.round(ratio * 100);

  // Color shifts when over 85%
  const fillColor = ratio >= 1 ? '#DC2626' : ratio >= 0.85 ? '#F97316' : color;

  const animatedRatio = useDerivedValue(() => withTiming(ratio, { duration: 600 }), [ratio]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedRatio.value),
  }));

  return (
    <View className="items-center flex-1">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={fillColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View className="absolute items-center justify-center" style={{ width: size, height: size }}>
          <Text className="font-sans-bold text-sm" style={{ color: fillColor }}>
            {percentage}%
          </Text>
        </View>
      </View>
      <Text className="font-sans-semibold text-xs text-foreground mt-1.5">
        {label}
      </Text>
      <Text className="font-sans text-xs text-muted-foreground mt-0.5">
        {formatPLN(spent)} / {formatPLN(budget)}
      </Text>
    </View>
  );
}

export function BudgetAllocation() {
  const { needs, wants, savings } = useBudgetAllocation();
  const monthKey = getCurrentMonthKey();
  const transactions = useMonthlyTransactions(monthKey);

  // Savings = goal contributions + investments this month
  const goalContributions = useFinanceStore((s) => s.goalContributions);
  const investmentEntries = useFinanceStore((s) => s.investmentEntries);

  const needsSpent = transactions
    .filter((t) => NEEDS_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const wantsSpent = transactions
    .filter((t) => WANTS_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsSpent =
    goalContributions
      .filter((gc) => getMonthKey(gc.date) === monthKey)
      .reduce((sum, gc) => sum + gc.amount, 0) +
    investmentEntries
      .filter((e) => getMonthKey(e.date) === monthKey)
      .reduce((sum, e) => sum + e.amount, 0);

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 mb-3">
      <View className="flex-row">
        <MiniGauge label="Needs" spent={needsSpent} budget={needs} color="#3B82F6" />
        <MiniGauge label="Wants" spent={wantsSpent} budget={wants} color="#F97316" />
        <MiniGauge label="Savings" spent={savingsSpent} budget={savings} color="#059669" />
      </View>
    </View>
  );
}
