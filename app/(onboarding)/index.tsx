import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ContinueButton } from '../../components/onboarding/continue-button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-8">
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            backgroundColor: '#1E40AF20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <Feather name="trending-up" size={64} color="#3B82F6" />
        </View>

        <Text className="font-sans-bold text-3xl text-foreground text-center">
          Welcome to Fortly
        </Text>

        <Text className="font-sans text-base text-muted-foreground text-center mt-4 leading-6">
          Let's set up your finances in under 2 minutes
        </Text>
      </View>

      <View className="px-5 pb-4">
        <ContinueButton
          label="Get Started"
          onPress={() => router.push('/(onboarding)/income')}
        />
      </View>
    </SafeAreaView>
  );
}
