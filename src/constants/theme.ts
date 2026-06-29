import { appTheme } from '@src/theme/theme-manager';

export const Colors = {
  light: appTheme.colors.light,
  dark: appTheme.colors.dark,
} as const;

export const Fonts = appTheme.fonts;
export const Radius = appTheme.radii;
export const Spacing = appTheme.spacing;
