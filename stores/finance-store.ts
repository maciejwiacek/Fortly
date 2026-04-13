import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BUDGET_STRATEGIES } from '../lib/types';
import type { FinanceStore } from '../lib/types';

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      isOnboardingComplete: false,
      completeOnboarding: () => set({ isOnboardingComplete: true }),

      themePreference: 'system',
      setThemePreference: (pref) => set({ themePreference: pref }),

      monthlyIncome: 0,
      budgetStrategy: BUDGET_STRATEGIES['50-30-20'],
      transactions: [],
      goals: [],
      goalContributions: [],
      investmentEntries: [],
      chatMessages: [],

      // Transactions
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: randomUUID(), createdAt: new Date().toISOString() },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Goals
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            { ...goal, id: randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
          goalContributions: state.goalContributions.filter(
            (gc) => gc.goalId !== id
          ),
        })),

      addGoalContribution: (gc) =>
        set((state) => ({
          goalContributions: [
            { ...gc, id: randomUUID() },
            ...state.goalContributions,
          ],
        })),

      deleteGoalContribution: (id) =>
        set((state) => ({
          goalContributions: state.goalContributions.filter(
            (gc) => gc.id !== id
          ),
        })),

      // Investments
      addInvestment: (entry) =>
        set((state) => ({
          investmentEntries: [
            { ...entry, id: randomUUID() },
            ...state.investmentEntries,
          ],
        })),

      deleteInvestment: (id) =>
        set((state) => ({
          investmentEntries: state.investmentEntries.filter(
            (e) => e.id !== id
          ),
        })),

      // Chat
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              ...message,
              id: randomUUID(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      clearChat: () => set({ chatMessages: [] }),

      // Settings
      setBudgetStrategy: (strategy) => set({ budgetStrategy: strategy }),
      setMonthlyIncome: (amount) => set({ monthlyIncome: amount }),
    }),
    {
      name: 'fortly-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 5,
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          persistedState.chatMessages = [];
        }
        if (version < 4) {
          persistedState.isOnboardingComplete = persistedState.monthlyIncome > 0;
        }
        if (version < 5) {
          persistedState.themePreference = 'system';
        }
        return persistedState;
      },
    }
  )
);
