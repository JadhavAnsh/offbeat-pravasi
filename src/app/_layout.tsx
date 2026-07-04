import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import 'react-native-reanimated';

import { AppProvider } from '@/providers/app-provider';
import { useAuthStore } from '@/features/auth/store';
import { useAppTheme } from '@/theme/theme-manager';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { mode, palette } = useAppTheme();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
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
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Protected guard={hasHydrated && !isLoggedIn}>
            <Stack.Screen name="auth" options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen name="verify-otp" options={{ headerShown: false, animation: 'slide_from_right' }} />
          </Stack.Protected>
          <Stack.Protected guard={hasHydrated && isLoggedIn}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Architecture' }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
