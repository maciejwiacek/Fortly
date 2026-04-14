import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AnimatedTabScreen } from '../../components/navigation/AnimatedTabScreen';
import { GoalCard } from '../../components/goals/goal-card';
import { CreateGoalSheet } from '../../components/goals/create-goal-sheet';
import { InvestmentSection } from '../../components/investments/investment-checklist';
import { useAllGoalsProgress } from '../../hooks/use-goal-progress';
import { useThemeColors } from '../../hooks/use-theme-colors';

export default function GoalsScreen() {
  const goals = useAllGoalsProgress();
  const colors = useThemeColors();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AnimatedTabScreen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View>
            <Text className="font-sans-bold text-2xl text-foreground">Goals</Text>
            <Text className="font-sans text-sm text-muted-foreground mt-0.5">
              Track your financial targets
            </Text>
          </View>
          <Pressable
            onPress={() => setShowCreate(true)}
            className="bg-primary rounded-xl w-10 h-10 items-center justify-center"
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {goals.length === 0 ? (
          <View className="items-center py-16 mx-4">
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Feather name="target" size={28} color={colors.mutedForeground} />
            </View>
            <Text className="font-sans-semibold text-base text-foreground mb-1">
              No goals yet
            </Text>
            <Text className="font-sans text-sm text-muted-foreground text-center">
              Create your first savings goal or debt payoff target
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
          </View>
        )}

        <View className="mt-2">
          <InvestmentSection />
        </View>

        <SafeAreaView edges={['bottom']} style={{ height: 120 }} />
      </ScrollView>

      </AnimatedTabScreen>
      {showCreate && <CreateGoalSheet onClose={() => setShowCreate(false)} />}
    </SafeAreaView>
  );
}
