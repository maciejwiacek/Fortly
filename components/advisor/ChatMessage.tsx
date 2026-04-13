import { Sparkles } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';

import type { ChatMessage as ChatMessageType } from '../../lib/types';

interface Props {
  message: ChatMessageType;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: Props) {
  const isUser = message.role === 'user';

  return (
    <View
      className={`mb-3 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <View className="w-7 h-7 rounded-full bg-card items-center justify-center mr-2 mt-1"
          style={{ borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <Sparkles size={14} color="#8B5CF6" />
        </View>
      )}

      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary rounded-br-md'
            : 'bg-card rounded-bl-md'
        }`}
        style={{ maxWidth: '78%' }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#8B5CF6" />
        ) : (
          <Text
            className={`font-sans text-sm leading-5 ${
              isUser ? 'text-white' : 'text-foreground'
            }`}
          >
            {message.content}
          </Text>
        )}
      </View>
    </View>
  );
}
