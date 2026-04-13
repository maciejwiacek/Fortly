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
    <View className="px-4 py-2">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.border,
          paddingLeft: 16,
          paddingRight: 6,
          minHeight: 44,
        }}
      >
        <TextInput
          placeholder="Ask about your finances..."
          placeholderTextColor={colors.muted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!disabled}
          multiline
          style={{
            flex: 1,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: colors.foreground,
            maxHeight: 80,
            paddingVertical: 10,
          }}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: canSend ? colors.primary : colors.primary + '20',
            marginLeft: 8,
          }}
        >
          <Feather name="arrow-up" size={16} color={canSend ? '#FFFFFF' : colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}
