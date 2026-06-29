import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { APP_ROUTES } from '@src/navigation/routes';
import { tokens, useAppTheme } from '@src/theme/theme-manager';

const tokenGroups = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'surface',
  'foreground',
  'muted',
  'border',
  'radius',
  'spacing',
  'headline',
  'body',
] as const;

export function ExploreScreen() {
  const { palette } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: palette.tint }]}>Design system</Text>
        <Text style={[styles.title, { color: palette.text }]}>NativeWind-ready tokens are in place.</Text>
        <Text style={[styles.copy, { color: palette.muted }]}>
          The screenshot palette has been captured in JSON and exposed through a theme manager for
          both StyleSheet and className workflows.
        </Text>
      </View>

      <SectionCard
        title="Token groups"
        description="Use these names in theme-aware components and NativeWind aliases.">
        <View style={styles.folderGrid}>
          {tokenGroups.map((folder) => (
            <View
              key={folder}
              style={[styles.folderPill, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
              <Text style={[styles.folderText, { color: palette.text }]}>{folder}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="NativeWind usage"
        description="Tailwind aliases are sourced from the same JSON design token file.">
        <Text style={[styles.code, { color: palette.text, borderColor: palette.border }]}>
          {`<View className="rounded-lg border border-border bg-surface p-lg" />`}
        </Text>
      </SectionCard>

      <SectionCard
        title="Reference colors"
        description={`${tokens.brand.name} starts from the four colors in the attached board.`}>
        <Text style={[styles.copy, { color: palette.muted }]}>
          Primary {tokens.colors.primary.base}, secondary {tokens.colors.secondary.base}, tertiary{' '}
          {tokens.colors.tertiary.base}, and neutral {tokens.colors.neutral[50]}.
        </Text>
        <Link href={APP_ROUTES.modal} style={[styles.link, { color: palette.tint }]}>
          Implementation notes
        </Link>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    fontWeight: '800',
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  folderPill: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  folderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  code: {
    borderRadius: Radius.md,
    borderWidth: 1,
    fontFamily: Fonts.mono,
    fontSize: 12,
    overflow: 'hidden',
    padding: 12,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },
});
