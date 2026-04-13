import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        card: '#192134',
        primary: { DEFAULT: '#1E40AF', light: '#3B82F6' },
        secondary: '#3B82F6',
        success: '#059669',
        warning: '#F97316',
        destructive: '#DC2626',
        muted: { DEFAULT: '#64748B', foreground: '#94A3B8' },
        foreground: '#F8FAFC',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-light': ['Inter_300Light'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
} satisfies Config;
