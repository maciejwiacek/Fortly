import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatInput } from '../../components/advisor/ChatInput';
import { ChatMessage } from '../../components/advisor/ChatMessage';
import { SuggestedPrompts } from '../../components/advisor/SuggestedPrompts';
import { buildFinancialContext } from '../../lib/ai-context';
import { chatWithAI } from '../../lib/gemini-api';
import type { ChatMessage as ChatMessageType } from '../../lib/types';
import { useFinanceStore } from '../../stores/finance-store';
import { useThemeColors } from '../../hooks/use-theme-colors';

function useKeyboard() {
  const height = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setIsOpen(true);
        // On Android, add extra offset so keyboard doesn't cover the input
        const extra = Platform.OS === 'android' ? 24 : 0;
        Animated.timing(height, {
          toValue: e.endCoordinates.height + extra,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      }
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        setIsOpen(false);
        Animated.timing(height, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      }
    );
    return () => { show.remove(); hide.remove(); };
  }, [height]);

  return { height, isOpen };
}

export default function AdvisorScreen() {
  const chatMessages = useFinanceStore((s) => s.chatMessages);
  const addChatMessage = useFinanceStore((s) => s.addChatMessage);
  const clearChat = useFinanceStore((s) => s.clearChat);

  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessageType>>(null);
  const { height: keyboardHeight, isOpen: keyboardOpen } = useKeyboard();

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages.length]);

  const handleSend = useCallback(
    async (text: string) => {
      addChatMessage({ role: 'user', content: text });
      setIsLoading(true);
      setError(null);

      try {
        const state = useFinanceStore.getState();
        const context = buildFinancialContext({
          monthlyIncome: state.monthlyIncome,
          budgetStrategy: state.budgetStrategy,
          transactions: state.transactions,
          goals: state.goals,
          goalContributions: state.goalContributions,
          investmentEntries: state.investmentEntries,
        });

        const response = await chatWithAI(state.chatMessages, context);

        if (response) {
          addChatMessage({ role: 'assistant', content: response });
        } else {
          setError('Could not connect to AI. Check your connection and try again.');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [addChatMessage]
  );

  const handleClear = useCallback(() => {
    Alert.alert(
      'New conversation',
      'Are you sure you want to clear the chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearChat },
      ]
    );
  }, [clearChat]);

  const handleRetry = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const state = useFinanceStore.getState();
      const context = buildFinancialContext({
        monthlyIncome: state.monthlyIncome,
        budgetStrategy: state.budgetStrategy,
        transactions: state.transactions,
        goals: state.goals,
        goalContributions: state.goalContributions,
        investmentEntries: state.investmentEntries,
      });

      const response = await chatWithAI(state.chatMessages, context);

      if (response) {
        addChatMessage({ role: 'assistant', content: response });
      } else {
        setError('Could not connect to AI. Check your connection and try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [addChatMessage]);

  const displayData: ChatMessageType[] = [
    ...chatMessages,
    ...(isLoading
      ? [
          {
            id: '__loading__',
            role: 'assistant' as const,
            content: '',
            timestamp: '',
          },
        ]
      : []),
  ];

  return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
          <View>
            <Text className="font-sans-bold text-2xl text-foreground">
              AI Advisor
            </Text>
            <Text className="font-sans text-sm text-muted-foreground mt-0.5">
              Your personal financial advisor
            </Text>
          </View>
          {chatMessages.length > 0 && (
            <Pressable onPress={handleClear} className="p-2 bg-card rounded-xl">
              <Feather name="trash-2" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Chat area */}
        {chatMessages.length === 0 && !isLoading ? (
          <SuggestedPrompts onSelect={handleSend} />
        ) : (
          <FlatList
            ref={listRef}
            data={displayData}
            renderItem={({ item }) => (
              <ChatMessage
                message={item}
                isLoading={item.id === '__loading__'}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
          />
        )}

        {/* Error banner */}
        {error && (
          <View className="mx-4 mb-2 bg-card rounded-xl p-3 flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: colors.destructive + '30' }}
          >
            <Text className="font-sans text-xs text-destructive flex-1 mr-2">
              {error}
            </Text>
            <Pressable onPress={handleRetry}>
              <Text className="font-sans-medium text-xs text-secondary">
                Retry
              </Text>
            </Pressable>
          </View>
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
        <Animated.View style={{ height: keyboardHeight }} />
        {/* Spacer for floating tab bar — hidden when keyboard is open */}
        {!keyboardOpen && <View style={{ height: 96 }} />}
      </SafeAreaView>
  );
}
