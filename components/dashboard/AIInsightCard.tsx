import { Sparkles } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useAIInsights } from '../../hooks/use-ai-insights';

export function AIInsightCard() {
  const { insight, isLoading, refresh } = useAIInsights();

  return (
    <View
      className="bg-card rounded-2xl p-4 mx-4 mb-3"
      style={{ borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.25)' }}
    >
      <View className="flex-row items-center mb-2">
        <Sparkles size={14} color="#8B5CF6" />
        <Text className="font-sans-medium text-xs text-muted-foreground ml-1.5">
          AI Insight
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#8B5CF6" style={{ marginVertical: 8 }} />
      ) : (
        <Text className="font-sans text-sm text-foreground leading-5">
          {insight}
        </Text>
      )}

      <Pressable onPress={refresh} className="mt-2">
        <Text className="font-sans-medium text-xs text-secondary">
          Nowa podpowiedź
        </Text>
      </Pressable>
    </View>
  );
}
