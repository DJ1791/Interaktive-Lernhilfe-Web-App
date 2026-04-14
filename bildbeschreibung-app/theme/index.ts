import { StyleSheet } from 'react-native';

export const colors = {
  background: '#111125',
  backgroundLight: '#1a1a35',
  surface: 'rgba(255,255,255,0.06)',
  surfaceBorder: 'rgba(255,255,255,0.10)',
  primary: '#edb1ff',
  secondary: '#ffb1c5',
  tertiary: '#ffb870',
  text: '#e2e0fc',
  textMuted: '#d1c2d2',
  textDim: '#9a8c9b',
  accent1: '#9d50bb',
  accent2: '#8b0e45',
  error: '#ffb4ab',
  success: '#4ade80',
  gradientPrimary: ['#9d50bb', '#8b0e45'] as const,
  gradientSecondary: ['#8b0e45', '#a56100'] as const,
  gradientAccent: ['#ffb1c5', '#ffb870'] as const,
  phase1: '#edb1ff',
  phase2: '#ffb1c5',
  phase3: '#ffb870',
  phase4: '#edb1ff',
};

export const fonts = {
  headline: 'PlusJakartaSans_700Bold',
  headlineBlack: 'PlusJakartaSans_800ExtraBold',
  headlineMedium: 'PlusJakartaSans_600SemiBold',
  body: 'BeVietnamPro_400Regular',
  bodyMedium: 'BeVietnamPro_500Medium',
  bodySemiBold: 'BeVietnamPro_600SemiBold',
  bodyBold: 'BeVietnamPro_700Bold',
  bodyLight: 'BeVietnamPro_300Light',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const glassStyle = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'rgba(17,17,37,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
});
