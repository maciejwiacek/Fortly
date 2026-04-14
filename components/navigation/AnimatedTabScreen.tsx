import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
}

export function AnimatedTabScreen({ children }: Props) {
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 200 });
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
