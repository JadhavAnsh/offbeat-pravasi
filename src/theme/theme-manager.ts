import { Platform, useColorScheme as useNativeColorScheme } from 'react-native';

import themeTokens from './theme.json';

import type { ColorSchemeName } from 'react-native';

export type AppThemeMode = 'light' | 'dark';
export type ThemeTokens = typeof themeTokens;
export type ThemePalette = ThemeTokens['semantic'][AppThemeMode];

const platformFonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Plus Jakarta Sans', Manrope, system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});

export const tokens = themeTokens;

export const appTheme = {
  tokens,
  colors: tokens.semantic,
  radii: tokens.radii,
  spacing: tokens.spacing,
  fonts: platformFonts,
  nativeWind: {
    colors: {
      primary: tokens.colors.primary.base,
      'primary-foreground': tokens.colors.primary.foreground,
      secondary: tokens.colors.secondary.base,
      'secondary-foreground': tokens.colors.secondary.foreground,
      tertiary: tokens.colors.tertiary.base,
      'tertiary-foreground': tokens.colors.tertiary.foreground,
      background: tokens.semantic.light.background,
      surface: tokens.semantic.light.surface,
      'surface-muted': tokens.semantic.light.surfaceMuted,
      foreground: tokens.semantic.light.text,
      muted: tokens.semantic.light.muted,
      border: tokens.semantic.light.border,
      link: tokens.semantic.light.link,
      danger: tokens.colors.danger.base,
      'danger-foreground': tokens.colors.danger.foreground,
    },
    darkColors: {
      background: tokens.semantic.dark.background,
      surface: tokens.semantic.dark.surface,
      'surface-muted': tokens.semantic.dark.surfaceMuted,
      foreground: tokens.semantic.dark.text,
      muted: tokens.semantic.dark.muted,
      border: tokens.semantic.dark.border,
      link: tokens.semantic.dark.link,
    },
    radii: tokens.radii,
    spacing: tokens.spacing,
  },
} as const;

export function getThemeMode(colorScheme: ColorSchemeName): AppThemeMode {
  return colorScheme === 'dark' ? 'dark' : 'light';
}

export function getPalette(colorScheme: ColorSchemeName): ThemePalette {
  return appTheme.colors[getThemeMode(colorScheme)];
}

export function useAppTheme() {
  const colorScheme = useNativeColorScheme();
  const mode = getThemeMode(colorScheme);

  return {
    mode,
    palette: appTheme.colors[mode],
    tokens,
    theme: appTheme,
  };
}

export const nativeWindClasses = {
  screen: 'flex-1 bg-background dark:bg-background',
  card: 'rounded-lg border border-border bg-surface p-lg dark:border-border dark:bg-surface',
  primaryButton: 'rounded-pill bg-primary px-lg py-sm',
  primaryButtonText: 'text-primary-foreground font-bold',
  secondaryButton: 'rounded-pill bg-secondary px-lg py-sm',
  label: 'text-foreground font-bold',
  muted: 'text-muted',
} as const;
