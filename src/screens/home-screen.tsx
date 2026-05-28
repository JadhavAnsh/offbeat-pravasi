import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { appImages } from '@src/assets';
import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Colors, Fonts } from '@src/constants/theme';
import { useColorScheme } from '@src/hooks/use-color-scheme';
import { useAppDiagnostics } from '@src/hooks/use-app-diagnostics';
import { APP_ROUTES } from '@src/navigation/routes';
import { useAppStore } from '@src/store/app-store';
import { formatLabel, getInitials } from '@src/utils/format';

export function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const diagnosticsQuery = useAppDiagnostics();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const nextThemePreference =
    themePreference === 'system'
      ? 'light'
      : themePreference === 'light'
        ? 'dark'
        : 'system';

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: palette.tint }]}>Expo SDK 54 foundation</Text>
          <Text style={[styles.title, { color: palette.text }]}>Reusable app architecture is in place.</Text>
          <Text style={[styles.description, { color: palette.muted }]}>
            `src/` now contains shared API, query, state, validation, and utility layers ready for
            feature work.
          </Text>
        </View>
        <View style={[styles.logoShell, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Image source={appImages.brandMark} style={styles.logo} contentFit="contain" />
          <Text style={[styles.logoLabel, { color: palette.text }]}>{getInitials('OffBeat Pravasi')}</Text>
        </View>
      </View>

      <SectionCard
        title="Global store"
        description="Persisted Zustand state for cross-app preferences and onboarding flags.">
        <View style={styles.row}>
          <View style={styles.rowCopy}>
            <Text style={[styles.label, { color: palette.text }]}>Theme preference</Text>
            <Text style={[styles.value, { color: palette.muted }]}>{formatLabel(themePreference)}</Text>
          </View>
          <Pressable
            onPress={() => setThemePreference(nextThemePreference)}
            style={[styles.button, { backgroundColor: palette.tint }]}>
            <Text style={styles.buttonText}>Cycle theme</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <View style={styles.rowCopy}>
            <Text style={[styles.label, { color: palette.text }]}>Onboarding</Text>
            <Text style={[styles.value, { color: palette.muted }]}>
              {onboardingCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Pressable
            onPress={completeOnboarding}
            style={[styles.button, { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1 }]}>
            <Text style={[styles.outlineButtonText, { color: palette.text }]}>Mark done</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard
        title="React Query"
        description="Default query client and query factory helpers are available for API and service modules.">
        {diagnosticsQuery.isLoading ? (
          <ActivityIndicator color={palette.tint} />
        ) : (
          diagnosticsQuery.data?.map((item) => (
            <View key={item.label} style={styles.metricRow}>
              <Text style={[styles.label, { color: palette.text }]}>{item.label}</Text>
              <Text style={[styles.value, { color: palette.muted }]}>{item.value}</Text>
            </View>
          ))
        )}
      </SectionCard>

      <Link href={APP_ROUTES.explore} style={[styles.inlineLink, { color: palette.tint }]}>
        Explore the folder map
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  logoShell: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    minHeight: 120,
    minWidth: 120,
    padding: 12,
  },
  logo: {
    height: 54,
    width: 54,
  },
  logoLabel: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  metricRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  inlineLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});
