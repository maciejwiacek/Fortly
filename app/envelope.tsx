import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { PageHeader } from '../components/layout/page-header';
import { EnvelopeGauge } from '../components/envelope/envelope-gauge';
import { EnvelopeBreakdown } from '../components/envelope/envelope-breakdown';
import { useEnvelopeStatus } from '../hooks/use-envelope-status';
import { useThemeColors } from '../hooks/use-theme-colors';
import { getCurrentMonthKey, formatMonthDisplay } from '../lib/utils';

export default function EnvelopeDetailScreen() {
  const monthKey = getCurrentMonthKey();
  const { spent, limit, color } = useEnvelopeStatus(monthKey);
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Life & Pleasures',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
        }}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Life & Pleasures"
          subtitle={formatMonthDisplay(monthKey)}
        />
        <View className="items-center py-4">
          <EnvelopeGauge
            spent={spent}
            limit={limit}
            color={color}
            size={240}
            strokeWidth={16}
          />
        </View>
        <EnvelopeBreakdown monthKey={monthKey} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
