import { Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../hooks/use-theme-colors';

const PROMPTS = [
  'Jak moge zaoszczedzic wiecej w tym miesiacu?',
  'Przeanalizuj moje wydatki',
  'Jak przyspieszyc cel oszczednosciowy?',
  'Czy moj budzet jest optymalny?',
];

const ACCENT = '#8B5CF6';

interface Props {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: Props) {
  const colors = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Sparkles size={32} color={ACCENT} />
      <Text className="font-sans-semibold text-lg text-foreground mt-3 mb-6">
        O co chcesz zapytac?
      </Text>

      <View className="w-full" style={{ gap: 10 }}>
        {PROMPTS.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => onSelect(prompt)}
            className="bg-card rounded-xl px-4 py-3.5"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text className="font-sans-medium text-sm text-foreground">
              {prompt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
