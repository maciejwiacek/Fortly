import { View } from 'react-native';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface ProgressDotsProps {
  step: number;
  total: number;
}

export function ProgressDots({ step, total }: ProgressDotsProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center justify-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: i + 1 === step ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i + 1 === step ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
  );
}
