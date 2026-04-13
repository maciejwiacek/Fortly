import { Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

const PROMPTS = [
  'Jak mogę zaoszczędzić więcej w tym miesiącu?',
  'Przeanalizuj moje wydatki',
  'Jak przyspieszyć cel oszczędnościowy?',
  'Czy mój budżet jest optymalny?',
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Sparkles size={32} color="#8B5CF6" />
      <Text className="font-sans-semibold text-lg text-foreground mt-3 mb-6">
        O co chcesz zapytać?
      </Text>

      <View className="w-full" style={{ gap: 10 }}>
        {PROMPTS.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => onSelect(prompt)}
            className="bg-card rounded-xl px-4 py-3.5"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
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
