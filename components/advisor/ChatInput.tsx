import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View className="flex-row items-end px-4 py-3 bg-card"
      style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}
    >
      <TextInput
        className="flex-1 bg-background rounded-xl px-4 py-3 text-foreground font-sans text-sm mr-3"
        placeholder="Zapytaj o finanse..."
        placeholderTextColor="#64748B"
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
        style={{ backgroundColor: canSend ? '#3B82F6' : 'rgba(59, 130, 246, 0.3)' }}
      >
        <Feather name="send" size={18} color={canSend ? '#FFFFFF' : '#64748B'} />
      </Pressable>
    </View>
  );
}
