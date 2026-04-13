import { View } from 'react-native';

interface ProgressDotsProps {
  step: number; // 1-based
  total: number;
}

export function ProgressDots({ step, total }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: i + 1 === step ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i + 1 === step ? '#2563EB' : '#94A3B830',
          }}
        />
      ))}
    </View>
  );
}
