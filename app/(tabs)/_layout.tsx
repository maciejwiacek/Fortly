import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { QuickAddFab } from '../../components/transactions/quick-add-fab';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#192134',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: 1,
            height: 85,
            paddingBottom: 28,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_500Medium',
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Feather name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, size }) => (
              <Feather name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, size }) => (
              <Feather name="target" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="advisor"
          options={{
            title: 'AI Doradca',
            tabBarIcon: ({ color, size }) => (
              <Feather name="zap" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{ href: null }}
        />
      </Tabs>
      <QuickAddFab />
    </View>
  );
}
