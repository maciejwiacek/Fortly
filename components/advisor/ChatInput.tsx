import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const colors = useThemeColors();

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View className="flex-row items-end px-4 py-3 bg-card"
      style={{ borderTopWidth: 1, borderTopColor: colors.border }}
    >
      <TextInput
        className="flex-1 bg-background rounded-xl px-4 py-3 text-foreground font-sans text-sm mr-3"
        placeholder="Zapytaj o finanse..."
        placeholderTextColor={colors.muted}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        editable={!disabled}
        multiline
        style={{ maxHeight: 100 }}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: canSend ? colors.primaryLight : colors.primaryLight + '30' }}
      >
        <Feather name="send" size={18} color={canSend ? '#FFFFFF' : colors.muted} />
      </Pressable>
    </View>
  );
}
