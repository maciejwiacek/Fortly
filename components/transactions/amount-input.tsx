import { useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';

interface AmountInputProps {
  value: number; // grosze
  onChange: (grosze: number) => void;
  autoFocus?: boolean;
}

export function AmountInput({ value, onChange, autoFocus = true }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? (value / 100).toFixed(2) : ''
  );
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const handleChange = (text: string) => {
    // Allow only numbers and one decimal separator
    const cleaned = text.replace(/[^0-9.,]/g, '').replace(',', '.');

    // Prevent multiple dots
    const parts = cleaned.split('.');
    if (parts.length > 2) return;

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;

    setDisplayValue(cleaned);

    const numericValue = parseFloat(cleaned);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onChange(Math.round(numericValue * 100));
    } else if (cleaned === '' || cleaned === '.') {
      onChange(0);
    }
  };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className="items-center py-6"
    >
      <View className="flex-row items-baseline">
        <TextInput
          ref={inputRef}
          value={displayValue}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#64748B"
          className="font-sans-light text-foreground text-center"
          style={{ fontSize: 48, minWidth: 120 }}
          selectionColor="#3B82F6"
        />
        <Text className="font-sans text-2xl text-muted-foreground ml-2">
          zl
        </Text>
      </View>
    </Pressable>
  );
}
