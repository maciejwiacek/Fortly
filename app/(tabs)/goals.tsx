import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { PageHeader } from '../../components/layout/page-header';
import { GoalCard } from '../../components/goals/goal-card';
import { CreateGoalSheet } from '../../components/goals/create-goal-sheet';
import { InvestmentSection } from '../../components/investments/investment-checklist';
import { useAllGoalsProgress } from '../../hooks/use-goal-progress';

export default function GoalsScreen() {
  const goals = useAllGoalsProgress();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pr-4">
          <PageHeader title="Goals" subtitle="Track your financial targets" />
          <Pressable
            onPress={() => setShowCreate(true)}
            className="bg-primary rounded-full w-10 h-10 items-center justify-center"
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {goals.length === 0 ? (
          <View className="items-center py-12 mx-4">
            <Text className="text-4xl mb-3">🎯</Text>
            <Text className="font-sans-semibold text-base text-foreground mb-1">
              No goals yet
            </Text>
            <Text className="font-sans text-sm text-muted-foreground text-center">
              Create your first savings goal or debt payoff target
            </Text>
          </View>
        ) : (
          goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}

        <View className="mt-4">
          <InvestmentSection />
        </View>

        <SafeAreaView edges={['bottom']} style={{ height: 120 }} />
      </ScrollView>

      {showCreate && <CreateGoalSheet onClose={() => setShowCreate(false)} />}
    </SafeAreaView>
  );
}
