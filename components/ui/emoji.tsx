import { Text, Platform } from 'react-native';

interface EmojiProps {
  children: string;
  size?: number;
  style?: object;
}

/**
 * Renders emoji using the system font, bypassing NativeWind's custom font.
 * Without this, NativeWind injects Inter font which can't render emoji on iOS.
 */
export function Emoji({ children, size = 24, style }: EmojiProps) {
  return (
    <Text
      style={[
        {
          fontSize: size,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          lineHeight: size * 1.2,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
