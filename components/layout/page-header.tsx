import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  greeting?: boolean;
  showSettings?: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function PageHeader({ title, subtitle, greeting, showSettings }: PageHeaderProps) {
  const router = useRouter();
  const colors = useThemeColors();

  const displayTitle = greeting ? getGreeting() : title;

  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
      <View className="flex-1">
        <Text className="font-sans-bold text-2xl text-foreground">{displayTitle}</Text>
        {subtitle && (
          <Text className="font-sans text-sm text-muted-foreground mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {showSettings && (
        <Pressable
          onPress={() => router.push('/settings')}
          className="p-2"
          hitSlop={8}
        >
          <Feather name="settings" size={22} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}
