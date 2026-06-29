const tokens = require('./src/theme/theme.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
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
      borderRadius: {
        xs: tokens.radii.xs,
        sm: tokens.radii.sm,
        md: tokens.radii.md,
        lg: tokens.radii.lg,
        xl: tokens.radii.xl,
        pill: tokens.radii.pill,
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
        '2xl': tokens.spacing['2xl'],
        '3xl': tokens.spacing['3xl'],
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
};
