import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAllGoalsProgress } from '../../hooks/use-goal-progress';
import { formatPLN } from '../../lib/utils';

export function GoalsSummary() {
  const goals = useAllGoalsProgress();
  const router = useRouter();

  if (goals.length === 0) return null;

  return (
    <View className="mx-4 mb-3">
      <Text className="font-sans-medium text-xs text-muted-foreground mb-3 px-1">
        Goals
      </Text>
      {goals.map((goal) => (
        <Pressable
          key={goal.id}
          onPress={() => router.push('/goals' as any)}
          className="bg-card rounded-2xl p-4 mb-2 flex-row items-center"
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: goal.color + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Feather name={goal.icon as any} size={20} color={goal.color} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-medium text-sm text-foreground">
              {goal.label}
            </Text>
            <Text className="font-sans text-xs text-muted-foreground">
              {goal.isDebt
                ? `${formatPLN(goal.remaining)} left`
                : `${formatPLN(goal.contributed)} saved`}
            </Text>
          </View>
          <Text className="font-sans-bold text-sm" style={{ color: goal.color }}>
            {goal.percentage}%
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
