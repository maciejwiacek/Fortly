import { COLORS_LIGHT, COLORS_DARK } from '../lib/constants';
import { useTheme } from './use-theme';

export function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? COLORS_DARK : COLORS_LIGHT;
}
