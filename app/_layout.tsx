import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';
import { useFinanceStore } from '../stores/finance-store';
import { useStoreHydration } from '../hooks/use-store-hydration';
import { useTheme } from '../hooks/use-theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(onboarding)',
};

SplashScreen.preventAutoHideAsync();

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8F9FB',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    primary: '#2563EB',
    notification: '#F97316',
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F172A',
    card: '#192134',
    text: '#F8FAFC',
    border: 'rgba(255,255,255,0.08)',
    primary: '#3B82F6',
    notification: '#F97316',
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const router = useRouter();
  const segments = useSegments();
  const isOnboardingComplete = useFinanceStore((s) => s.isOnboardingComplete);
  const hydrated = useStoreHydration();
  const { isDark } = useTheme();

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated]);

  useEffect(() => {
    if (!fontsLoaded || !hydrated) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (isOnboardingComplete && inOnboarding) {
      router.replace('/(tabs)');
    } else if (!isOnboardingComplete && !inOnboarding) {
      router.replace('/(onboarding)');
    }
  }, [fontsLoaded, hydrated, isOnboardingComplete, segments]);

  if (!fontsLoaded || !hydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className={isDark ? 'dark' : ''}>
      <ThemeProvider value={isDark ? DarkNavTheme : LightNavTheme}>
        <View style={{ flex: 1 }} className={isDark ? 'dark bg-background' : 'bg-background'}>
          <Stack>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen
              name="add-transaction"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="envelope"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
