import { Sparkles } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/use-theme-colors';
import { useAIInsights } from '../../hooks/use-ai-insights';

export function AIInsightCard() {
  const { insight, isLoading, refresh } = useAIInsights();
  const colors = useThemeColors();

  return (
    <View className="mx-4 mb-3">
      <View className="bg-card rounded-2xl px-4 py-3 flex-row items-center">
        <Sparkles size={14} color="#8B5CF6" style={{ marginRight: 8 }} />
        <View className="flex-1">
          {isLoading ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : (
            <Text className="font-sans text-xs text-foreground" numberOfLines={2}>
              {insight}
            </Text>
          )}
        </View>
        <Pressable onPress={refresh} className="p-1.5 ml-2">
          <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}
