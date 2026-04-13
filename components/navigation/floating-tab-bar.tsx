import { useEffect, useState } from 'react';
import { View, Pressable, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  transactions: 'list',
  goals: 'target',
  advisor: 'zap',
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  const bottomOffset = Math.max(insets.bottom, 12);

  const handleTabPress = (routeName: string) => {
    Haptics.selectionAsync();
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find((r) => r.name === routeName)?.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleAddPress = () => {
    Haptics.selectionAsync();
    router.push('/add-transaction');
  };

  const tabRoutes = state.routes.filter((r) => TAB_ICONS[r.name]);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 24,
        right: 24,
        alignItems: 'center',
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1C1C1E',
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 16,
          gap: 4,
        }}
      >
        {tabRoutes.map((route, index) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const iconName = TAB_ICONS[route.name];

          // Insert center FAB before the third tab (after index 1)
          const elements = [];

          if (index === 2) {
            elements.push(
              <Pressable
                key="fab"
                onPress={handleAddPress}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#3B82F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 4,
                }}
              >
                <Feather name="plus" size={24} color="#FFFFFF" />
              </Pressable>
            );
          }

          elements.push(
            <Pressable
              key={route.key}
              onPress={() => handleTabPress(route.name)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFocused ? 'rgba(255,255,255,0.12)' : 'transparent',
              }}
            >
              <Feather
                name={iconName as any}
                size={22}
                color={isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
              />
            </Pressable>
          );

          return elements;
        })}
      </View>
    </View>
  );
}
