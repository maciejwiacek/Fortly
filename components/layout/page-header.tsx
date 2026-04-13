import { View, Text } from 'react-native';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <View className="px-4 pt-4 pb-2">
      <Text className="font-sans-bold text-2xl text-foreground">{title}</Text>
      {subtitle && (
        <Text className="font-sans text-sm text-muted-foreground mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
