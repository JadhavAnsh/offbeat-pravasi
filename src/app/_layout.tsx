import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import 'react-native-reanimated';

import { AppProvider } from '@/providers/app-provider';
import { useAppTheme } from '@/theme/theme-manager';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { mode, palette } = useAppTheme();
  const navigationTheme = mode === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <AppProvider>
      <ThemeProvider
        value={{
          ...navigationTheme,
          colors: {
            ...navigationTheme.colors,
            background: palette.background,
            border: palette.border,
            card: palette.surface,
            notification: palette.highlight,
            primary: palette.tint,
            text: palette.text,
          },
        }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Architecture' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
