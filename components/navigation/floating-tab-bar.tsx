import { useEffect, useState } from 'react';
import { View, Pressable, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../hooks/use-theme';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  transactions: 'list',
  goals: 'target',
  advisor: 'zap',
};

const TAB_ORDER = ['index', 'transactions', '__fab__', 'goals', 'advisor'];
const ITEM_SIZE = 48;
const FAB_SIZE = 48;
const PILL_GAP = 4;
const PILL_PADDING = 8;

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const indicatorX = useSharedValue(PILL_PADDING);

  const tabRoutes = state.routes.filter((r) => TAB_ICONS[r.name]);
  const activeTabName = tabRoutes[state.index]?.name;

  useEffect(() => {
    const tabIndex = TAB_ORDER.indexOf(activeTabName ?? 'index');
    const x = PILL_PADDING + tabIndex * (ITEM_SIZE + PILL_GAP);
    indicatorX.value = withTiming(x, { duration: 200, easing: Easing.out(Easing.quad) });
  }, [activeTabName]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const pillBg = isDark ? '#171717' : '#FAFAFA';
  const activeIconColor = isDark ? '#FAFAFA' : '#0A0A0A';
  const inactiveIconColor = isDark ? '#737373' : '#A3A3A3';
  const indicatorBg = isDark ? '#262626' : '#EBEBEB';
  const fabColor = isDark ? '#3B82F6' : '#2563EB';
  const shadowOpacity = isDark ? 0.5 : 0.08;
  const pillBorder = isDark ? '#262626' : '#EBEBEB';

  const indicatorStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: indicatorBg,
    left: indicatorX.value,
    top: PILL_PADDING,
  }));

  // Hide after all hooks have been called
  if (keyboardVisible) return null;

  const bottomOffset = Platform.OS === 'android'
    ? Math.max(insets.bottom, 24)
    : Math.max(insets.bottom, 12);

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
          backgroundColor: pillBg,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: pillBorder,
          paddingHorizontal: PILL_PADDING,
          paddingVertical: PILL_PADDING,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity,
          shadowRadius: 12,
          elevation: 12,
          gap: PILL_GAP,
        }}
      >
        <Animated.View style={indicatorStyle} />

        {TAB_ORDER.map((item) => {
          if (item === '__fab__') {
            return (
              <Pressable
                key="fab"
                onPress={handleAddPress}
                style={{
                  width: FAB_SIZE,
                  height: FAB_SIZE,
                  borderRadius: FAB_SIZE / 2,
                  backgroundColor: fabColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Feather name="plus" size={24} color="#FFFFFF" />
              </Pressable>
            );
          }

          const route = tabRoutes.find((r) => r.name === item);
          if (!route) return null;
          const isFocused = activeTabName === item;

          return (
            <Pressable
              key={route.key}
              onPress={() => handleTabPress(item)}
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                borderRadius: ITEM_SIZE / 2,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <Feather
                name={TAB_ICONS[item] as any}
                size={22}
                color={isFocused ? activeIconColor : inactiveIconColor}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
