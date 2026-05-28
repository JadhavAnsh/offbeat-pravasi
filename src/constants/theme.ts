import { Platform } from 'react-native';

const accentLight = '#0f766e';
const accentDark = '#5eead4';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    surface: '#ffffff',
    tint: accentLight,
    icon: '#475569',
    border: '#e2e8f0',
    muted: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: accentLight,
  },
  dark: {
    text: '#e2e8f0',
    background: '#020617',
    surface: '#0f172a',
    tint: accentDark,
    icon: '#94a3b8',
    border: '#1e293b',
    muted: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: accentDark,
  },
};

export const Fonts = Platform.select({
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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Trebuchet MS', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});
