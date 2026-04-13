import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ContinueButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ContinueButton({ label = 'Continue', onPress, disabled = false }: ContinueButtonProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`rounded-xl py-4 items-center ${disabled ? 'bg-card' : 'bg-primary'}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Text className={`font-sans-semibold text-base ${disabled ? 'text-muted-foreground' : 'text-white'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
