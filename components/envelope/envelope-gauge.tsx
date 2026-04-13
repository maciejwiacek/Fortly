import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { formatPLN, clamp } from '../../lib/utils';
import { useThemeColors } from '../../hooks/use-theme-colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface EnvelopeGaugeProps {
  spent: number; // grosze
  limit: number; // grosze
  color: string; // hex
  size?: number; // diameter in pt
  strokeWidth?: number;
}

export function EnvelopeGauge({
  spent,
  limit,
  color,
  size = 160,
  strokeWidth = 12,
}: EnvelopeGaugeProps) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = clamp(limit > 0 ? spent / limit : 0, 0, 1);
  const percentage = Math.round(ratio * 100);

  const animatedRatio = useDerivedValue(() => {
    return withTiming(ratio, { duration: 600 });
  }, [ratio]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedRatio.value);
    return { strokeDashoffset };
  });

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.trackBackground}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated fill */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        {/* Center text */}
        <View
          className="absolute items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text
            className="font-sans-semibold text-foreground"
            style={{ fontSize: size > 150 ? 18 : 14 }}
          >
            {formatPLN(spent)}
          </Text>
          <Text
            className="font-sans text-muted-foreground"
            style={{ fontSize: size > 150 ? 12 : 10 }}
          >
            / {formatPLN(limit)}
          </Text>
          <Text
            className="font-sans-bold mt-1"
            style={{ fontSize: size > 150 ? 16 : 12, color }}
          >
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}
