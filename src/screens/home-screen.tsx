import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { appImages } from '@src/assets';
import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { useAppDiagnostics } from '@src/hooks/use-app-diagnostics';
import { APP_ROUTES } from '@src/navigation/routes';
import { useAppStore } from '@src/store/app-store';
import { nativeWindClasses, tokens, useAppTheme } from '@src/theme/theme-manager';
import { formatLabel, getInitials } from '@src/utils/format';

export function HomeScreen() {
  const { palette } = useAppTheme();
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
          <Text style={[styles.eyebrow, { color: palette.tint }]}>OffBeat Pravasi</Text>
          <Text style={[styles.title, { color: palette.text }]}>Find the next trail before it finds the crowd.</Text>
          <Text style={[styles.description, { color: palette.muted }]}>
            A grounded travel interface for treks, local stories, bookings, and organizer tools.
          </Text>
        </View>
        <View style={[styles.logoShell, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Image source={appImages.brandMark} style={styles.logo} contentFit="contain" />
          <Text style={[styles.logoLabel, { color: palette.text }]}>{getInitials('OffBeat Pravasi')}</Text>
        </View>
      </View>

      <SectionCard
        title="Theme controls"
        description="Design tokens now drive colors, spacing, radii, tabs, cards, and buttons.">
        <View style={styles.row}>
          <View style={styles.rowCopy}>
            <Text style={[styles.label, { color: palette.text }]}>Theme preference</Text>
            <Text style={[styles.value, { color: palette.muted }]}>{formatLabel(themePreference)}</Text>
          </View>
          <Pressable
            onPress={() => setThemePreference(nextThemePreference)}
            className={nativeWindClasses.primaryButton}
            style={[styles.button, { backgroundColor: palette.tint }]}>
            <Text className={nativeWindClasses.primaryButtonText} style={styles.buttonText}>
              Cycle theme
            </Text>
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
            style={[
              styles.button,
              { backgroundColor: palette.surfaceMuted, borderColor: palette.border, borderWidth: 1 },
            ]}>
            <Text style={[styles.outlineButtonText, { color: palette.text }]}>Mark done</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard
        title="Reference palette"
        description="The attached board has been converted into app-ready design tokens.">
        <View style={styles.swatchRow}>
          <View style={[styles.swatch, { backgroundColor: tokens.colors.primary.base }]}>
            <Text style={styles.swatchLabel}>Primary</Text>
          </View>
          <View style={[styles.swatch, { backgroundColor: tokens.colors.secondary.base }]}>
            <Text style={styles.swatchLabel}>Secondary</Text>
          </View>
          <View style={[styles.swatch, { backgroundColor: tokens.colors.tertiary.base }]}>
            <Text style={[styles.swatchLabel, { color: tokens.colors.tertiary.foreground }]}>Tertiary</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="App readiness"
        description="Query, state, validation, and utility layers remain wired for feature work.">
        {diagnosticsQuery.isLoading ? (
          <ActivityIndicator color={palette.tint} />
        ) : diagnosticsQuery.isError ? (
          <View style={styles.metricRow}>
            <Text style={[styles.label, { color: palette.text }]}>Backend</Text>
            <Text style={[styles.value, { color: palette.muted }]}>Unavailable</Text>
          </View>
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
        Explore the design tokens
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
    gap: Spacing.sm,
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
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
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
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  rowCopy: {
    flex: 1,
    gap: Spacing.xs,
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
    borderRadius: Radius.pill,
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
  swatchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  swatch: {
    borderRadius: Radius.md,
    flex: 1,
    minHeight: 72,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  swatchLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
