import { useColorScheme } from 'nativewind';
import { useFinanceStore } from '../stores/finance-store';

export function useTheme() {
  const themePreference = useFinanceStore((s) => s.themePreference);
  const { colorScheme: systemScheme } = useColorScheme();

  const resolvedTheme: 'light' | 'dark' =
    themePreference === 'system'
      ? (systemScheme ?? 'light')
      : themePreference;

  const isDark = resolvedTheme === 'dark';

  return { themePreference, resolvedTheme, isDark };
}
