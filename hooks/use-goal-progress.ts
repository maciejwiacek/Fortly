import { useMemo } from 'react';
import { useFinanceStore } from '../stores/finance-store';
import type { Goal } from '../lib/types';

export interface GoalProgress {
  id: string;
  label: string;
  icon: string;
  color: string;
  targetAmount: number; // grosze
  contributed: number; // grosze
  remaining: number; // grosze
  percentage: number; // 0..100
  isDebt: boolean;
  isComplete: boolean;
}

export function useGoalProgress(goalId: string): GoalProgress | null {
  const goals = useFinanceStore((s) => s.goals);
  const goalContributions = useFinanceStore((s) => s.goalContributions);

  return useMemo(() => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return null;

    const contributed = goalContributions
      .filter((gc) => gc.goalId === goalId)
      .reduce((sum, gc) => sum + gc.amount, 0);

    const remaining = Math.max(0, goal.targetAmount - contributed);
    const percentage = Math.min(
      100,
      Math.round((contributed / goal.targetAmount) * 100)
    );

    return {
      id: goal.id,
      label: goal.label,
      icon: goal.icon,
      color: goal.color,
      targetAmount: goal.targetAmount,
      contributed,
      remaining,
      percentage,
      isDebt: goal.isDebt,
      isComplete: remaining === 0,
    };
  }, [goals, goalContributions, goalId]);
}

export function useAllGoalsProgress(): GoalProgress[] {
  const goals = useFinanceStore((s) => s.goals);
  const goalContributions = useFinanceStore((s) => s.goalContributions);

  return useMemo(
    () =>
      goals.map((goal) => {
        const contributed = goalContributions
          .filter((gc) => gc.goalId === goal.id)
          .reduce((sum, gc) => sum + gc.amount, 0);

        const remaining = Math.max(0, goal.targetAmount - contributed);
        const percentage = Math.min(
          100,
          Math.round((contributed / goal.targetAmount) * 100)
        );

        return {
          id: goal.id,
          label: goal.label,
          icon: goal.icon,
          color: goal.color,
          targetAmount: goal.targetAmount,
          contributed,
          remaining,
          percentage,
          isDebt: goal.isDebt,
          isComplete: remaining === 0,
        };
      }),
    [goals, goalContributions]
  );
}
