import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { EnvelopeGauge } from '../envelope/envelope-gauge';
import { useEnvelopeStatus } from '../../hooks/use-envelope-status';
import { getCurrentMonthKey } from '../../lib/utils';

export function DashboardEnvelopeRing() {
  const router = useRouter();
  const monthKey = getCurrentMonthKey();
  const { spent, limit, color } = useEnvelopeStatus(monthKey);

  return (
    <Pressable
      onPress={() => router.push('/envelope' as any)}
      className="bg-card rounded-2xl p-4 mx-4 mb-3 items-center"
    >
      <Text className="font-sans-medium text-xs text-muted-foreground mb-3">
        Wants Spending
      </Text>
      <EnvelopeGauge
        spent={spent}
        limit={limit}
        color={color}
        size={140}
        strokeWidth={10}
      />
    </Pressable>
  );
}
