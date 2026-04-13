import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
}

export function AnimatedTabScreen({ children }: Props) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = 0;
    }
  }, [isFocused]);

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
