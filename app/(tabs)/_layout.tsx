import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/navigation/floating-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="advisor" />
      <Tabs.Screen name="investments" options={{ href: null }} />
    </Tabs>
  );
}
